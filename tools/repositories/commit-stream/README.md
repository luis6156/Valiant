# Commit Stream
[![GitHub](https://img.shields.io/github/license/x1sec/commit-stream)](https://github.com/x1sec/commit-stream/blob/master/LICENSE)
[![GitHub all releases](https://img.shields.io/github/downloads/x1sec/commit-stream/total)](https://github.com/x1sec/commit-stream/releases)
[![GitHub go.mod Go version](https://img.shields.io/github/go-mod/go-version/x1sec/commit-stream)](https://go.dev/)
[![Twitter Follow](https://img.shields.io/twitter/follow/haxrob?style=social)](https://twitter.com/intent/follow?screen_name=haxrob)

`commit-stream` drinks commit logs from the Github event firehose exposing the author details (name and email address) associated with Github repositories in real time. 

OSINT / Recon uses for Redteamers / Bug bounty hunters: 

* Uncover repositories which employees of a target company is commiting code (filter by email domain)
* Identify repositories belonging to an individual (filter by author name)
* Chain with other tools such as trufflehog to extract secrets in uncovered repositories.

Companies have found the tool useful to discover repositories that their employees are committing intellectual property to.

[![asciicast](https://asciinema.org/a/317469.svg)](https://asciinema.org/a/317469)

## Installation
### Binaries
Compiled 64-bit executable files for Windows, Mac and Linux are available [here](https://github.com/x1sec/commit-stream/releases/)

## Docker
```
docker run x1sec/commit-stream
```

### Building from source
If you would prefer to build yourself (and Go is setup [correctly](https://golang.org/doc/install)):
```
go install github.com/x1sec/commit-stream@latest
```

# Usage

```
Usage:
  commit-stream [OPTIONS]

Options:
  -t, --token            Github token (if not specified, will use environment
                         variable 'CSTREAM_TOKEN' or from config.yaml)
  -e, --email-domain     Match email addresses field (specify multiple with comma)
                         Omit to match all.
  -n, --email-name       Match author name field (specify multiple with comma).
                         Omit to match all.
  -df --dom-file <file>  Match email domains specificed in file
  -a  --all-commits      Search through previous commit history (default: false)
  -i  --ignore-priv      Ignore noreply.github.com private email addresses (default: false)
  -m  --messages         Fetch commit messages (default: false)
  -c  --config [path]    Use configuration file (optional)
  -d  --debug            Enable debug messages to stderr (default:false)
  -h  --help             This message
```

### Tokens
`commit-stream` requires a Github personal access token to be used. You can generate a token navigating in Github [Settings / Developer Settings /  Personal Access Tokens] then selecting 'Generate new token'. Nothing here needs to be selected, just enter the name of the token and click generate.

Once the token has been created, the recommended method is to set it via an environment variable `CSTREAM_TOKEN`:
```
export CSTREAM_TOKEN=xxxxxxxxxx
```
Alternatively, the `--token` switch maybe used when invoking the program, e.g:
```
./commit-stream --token xxxxxxxxxx
```
The token can also be specified in `config.yaml`:
```
github:
  token: ghp_xxxxx
```

### Filtering
When running `commit-stream` with no options, it will immediately dump author details and the associated repositories in CSV format to the terminal. Filtering options are available. 

To filter by email domain:
```
./commit-stream --email-domain 'company.com'
```

To filter by author name:
```
./commit-stream --email-name 'John Smith'
```

Multiple keywords can be specified with a `,` character. e.g.
```
./commit-stream --email-domain 'telsa.com,ford.com'
```

To filter on a list of domain names specified in a text file, use  `-df, --dom-file`:
```
./commit-stream --dom-file domainlist.txt
```

Email addresses that have been set to private (`@users.noreply.github.com`) can be ommited by specifying `--ignore-priv`. This is useful to reduce the volume of data collected if running the tool for an extended period of time.

It is possible to search upto 20 previous commits for the filter keywords by specifying `--all-commits`. This may increase the likelihood of a positive matches.

commit-stream supports importing into Elastic Search. See [using Elastic Search](elasticsearch.md)

## Credits
Some inspiration was taken from [@Darkport's](https://twitter.com/darkp0rt) [ssshgit](https://github.com/eth0izzle/shhgit) excellent tool to extract secrets from Github in real-time. `commit-stream`'s objective is slightly different as it focuses on extracting the 'meta-data' as opposed to the content of the repositories.

### Note
Github provides the ability to prevent email addresses from being exposed. In the Github settings select `Keep my email addresses private` and `Block command line pushes that expose my email` under the Email options.

As only one token is used this software does not breach any terms of use with Github. That said, use at your own risk. The author does not hold any responsibility for it's usage.
