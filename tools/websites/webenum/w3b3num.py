####################################
# Developed by xeroxxhah
# A simple Web Enumeration Script
# Report any Bug at xeroxxhah@pm.me
####################################

import requests
import sys
import urllib.request
import ssl
from certifier import CertInfo
import dns.resolver
import whois
from rich import print,pretty
from time import sleep

# Executing rich's pretty method
pretty.install()

VERSION = '2.0.0'
BANNER = 'hi'


def seprateProtocol(url):
    if 'https' == url[:5].lower():
        return url[:5]
    elif 'http' == url[:4]:
        return url[:4]
    else:
        print('[red]Wrong url format[/red]\n[green]format: https://www.example.com[/green]')
        quit()

def striphost(url):
    stripedProto = url.strip(seprateProtocol(url)+'://')
    if stripedProto.split('.')[0].lower() == 'www':
        return stripedProto.split('.')[1] + '.' + stripedProto.split('.')[2]
    else:
        return stripedProto



def getHeader(url):
    try:
        response = urllib.request.urlopen(url)
        print(response.info())
    except Exception as e:
        print(f'Following Error occured:\n {e}')

def getcertinfo(url):
    try:
        cert = CertInfo(url, 443)
        print(
            f"""
            certificate: 
            {ssl.get_server_certificate((url,443))}
            ---------------------------------------
            ---------------------------------------
            ----------Certificate Info-------------
            Certificate Cipher: {cert.cipher()}
            Certificate Protocol: {cert.protocol()}
            Certificate Expiration Date: {cert.expire()}
            """
        )
    except Exception as e:
        print(f'Following Error occured:\n {e}')


def getdnsinfo(url):
    try:
        arec = dns.resolver.query(url, 'A')
        aaaarec = dns.resolver.query(url, 'AAAA')
        nsrec = dns.resolver.query(url, 'NS')
        mxrec = dns.resolver.query(url, 'MX')
        print("\nA Record:")
        for x in arec:
            print(x)
        print("\nAAAA Record:")
        for x in aaaarec:
             print(x)
        print("\nNS Record:")
        for x in nsrec:
            print(x)
        print("\nMX Record:")
        for x in mxrec:
            print(x)
    except Exception as e:
        print(f'Following Error occured:\n {e}')


def getwhoisinfo(url):
    try:
        return whois.whois(url)
    except Exception as e:
        print(f'Following Error occured:\n {e}')


def getsubdomain(url):
    protocol = seprateProtocol(url)
    if len(url.split('.')) > 3:
        formated_host = url.split('.')[1] + '.' + url.split('.')[2] + '.' + url.split('.')[3]
    else:
        try:
            formated_host = url.split('.')[1] + '.' + url.split('.')[2]
        except IndexError:
                try:
                    formated_host = url.split('//')[1]
                except Exception:
                    print("[red]Error:Bad Format[/red]\nUsage:w3b3num.py https://www.example.com")      
    print(f"[green]Host:{formated_host}[/green]")            

    
    with open('subdomains.txt') as subfile:
        content = subfile.read()
        subdomains = content.splitlines()
        for subdomain in subdomains:
            re_url = f'{protocol}://{subdomain}.{formated_host}'
            try:
                requests.get(re_url,stream=True,timeout=3)
                print('[+]',re_url)
            except Exception:
                pass
                




def main():
    print(f"[red]{BANNER}[/red]")
    host = ''
    if  len(sys.argv)  != 2:
        print("[red]Url operand missing[/red]")
        print(f"Usage:{sys.argv[0]} <host>")
        quit()
    else:
        host = sys.argv[1]
    sleep(2)
    print('[purple bold]Header Meta Data:[/purple bold]')    
    print('[purple]-----------------------------------------------------------------------------[/purple]')
    getHeader(host)
    print('[purple]-----------------------------------------------------------------------------[/purple]')
    print('[blue bold]Certificate Inforamtion:[/blue bold]')
    print('[blue]-----------------------------------------------------------------------------[/blue]')
    getcertinfo(striphost(host))
    print('[blue]-----------------------------------------------------------------------------[/blue]')
    print('[red bold]DNS Record:[/red bold]')
    print('[red]-----------------------------------------------------------------------------[/red]')
    getdnsinfo(striphost(host))
    print('[red]-----------------------------------------------------------------------------[/red]')
    print('\n[green bold]Whois Information:[/green bold]')
    print('[green]-----------------------------------------------------------------------------[/green]')
    print(getwhoisinfo(striphost(host)))
    print('[green]-----------------------------------------------------------------------------[/green]')
    print('\n[cyan bold]Subdomains:[/cyan bold]')
    print('[cyan]-----------------------------------------------------------------------------[/cyan]')
    getsubdomain(host)
    print('[cyan]-----------------------------------------------------------------------------[/cyan]')
    



main()
