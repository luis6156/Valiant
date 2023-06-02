/*
commit-stream
Author: https://twitter.com/haxrob
https://github.com/x1sec/commit-stream

See LICENSE
*/

package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	commitstream "github.com/x1sec/commit-stream/pkg"
)

func printAscii() {
	h := `
 ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗   ███████╗████████╗██████╗ ███████╗ █████╗ ███╗   ███╗
██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝   ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██╔══██╗████╗ ████║
██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║█████╗███████╗   ██║   ██████╔╝█████╗  ███████║██╔████╔██║
██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║╚════╝╚════██║   ██║   ██╔══██╗██╔══╝  ██╔══██║██║╚██╔╝██║
╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║      ███████║   ██║   ██║  ██║███████╗██║  ██║██║ ╚═╝ ██║
 ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝      ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ 
v0.2.0 https://github.com/x1sec/commit-stream | Twitter: @haxrob      

`
	fmt.Fprintf(os.Stderr, h)
}

func init() {
	flag.Usage = func() {
		printAscii()

		h := "Stream Github commit logs in real-time\n\n"
		h += "Usage:\n"
		h += "  commit-stream [OPTIONS]\n\n"

		h += "Options:\n"
		h += "  -t, --token            Github token (if not specified, will use environment\n"
		h += "                         variable 'CSTREAM_TOKEN' or from config.yaml)\n"
		h += "  -e, --email-domain     Match email addresses field (specify multiple with comma)\n"
		h += "                         Omit to match all.\n"
		h += "  -n, --email-name       Match author name field (specify multiple with comma).\n"
		h += "                         Omit to match all.\n"
		h += "  -df --dom-file <file>  Match email domains specificed in file\n"
		h += "  -a  --all-commits      Search through previous commit history (default: false)\n"
		h += "  -i  --ignore-priv      Ignore noreply.github.com private email addresses (default: false)\n"
		h += "  -m  --messages         Fetch commit messages (default: false)\n"
		h += "  -c  --config [path]    Use configuration file (optional)\n"
		h += "  -d  --debug            Enable debug messages to stderr (default:false)\n"
		h += "  -h  --help             This message\n"
		h += "\n\n"
		fmt.Fprintf(os.Stderr, h)
	}
}

func main() {

	var handler commitstream.Handler
	var flags FlagOptions
	PopulateOptions(&flags)

	var authToken string
	config := commitstream.Config{FilePath: flags.ConfigFile}
	if err := config.Load(); err != nil {
		log.Printf(err.Error())
	}

	if flags.AuthToken == "" {
		if config.Settings.Github.Token == "" {
			authToken = os.Getenv("CSTREAM_TOKEN")
		} else {
			authToken = config.Settings.Github.Token
		}

	} else {
		authToken = flags.AuthToken
	}
	if authToken == "" {
		log.Fatal("No Github token specified. Use '-t', or set environment variable CSTREAM_TOKEN or specify in config.yaml. -h for help.\n")
	}

	if config.Settings.Destination == "elastic" {
		settings := config.Settings.Elasticsearch

		log.Printf("Using ElasticSearch database: %s\n", settings.Uri)
		handler = commitstream.ElasticHandler{
			RemoteURI:    settings.Uri,
			Username:     settings.Username,
			Password:     settings.Password,
			NoDuplicates: settings.NoDuplicates,
			UseZincAwsS3: settings.UseZincAwsS3,
		}
		h := handler.(commitstream.ElasticHandler)
		h.Setup()

	} else {
		handler = commitstream.CsvHander{}
	}

	githubOptions := commitstream.GithubOptions{
		AuthToken: authToken,
	}

	cs := commitstream.CommitStream{
		GithubOptions: &githubOptions,
		Filter:        &flags.Filter,
		Debug:         flags.Debug,
	}

	cs.Start(handler)
}
