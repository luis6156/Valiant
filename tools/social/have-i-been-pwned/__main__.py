import argparse
import requests

def check_email_breaches(api_key, email):
    # Make a request to the HIBP API to check for breaches
    url = f'https://haveibeenpwned.com/api/v3/breachedaccount/{email}'
    headers = {
        'User-Agent': 'My Python Script',
        'hibp-api-key': api_key
    }
    response = requests.get(url, headers=headers)

    print(email, end=' ')

    if response.status_code == 200:
        # The email has been found in breaches
        print(f'true')
        # print(f'The email "{email}" has been found in the following breaches:')
        # breaches = response.json()
        # for breach in breaches:
        #     print('- ' + breach['Name'])
    elif response.status_code == 404:
        # The email has not been found in breaches
        print('false')
        # print(f'The email "{email}" has not been found in any known breaches.')
    else:
        # An error occurred
        print('API error')
        # print('An error occurred while checking the email for breaches.')

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('api_key', help='Your HIBP API key')
    parser.add_argument('email', help='Email address to check')
    args = parser.parse_args()

    api_key = args.api_key
    email = args.email

    check_email_breaches(api_key, email)
