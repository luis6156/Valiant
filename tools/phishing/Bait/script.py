import sys
import smtplib
from email.message import EmailMessage
from email.mime.text import MIMEText

def send_email(smtp_server, smtp_port, sender_email, sender_password, recipient_email, subject, message, html=False):
    # Create the email message
    email_message = EmailMessage()
    email_message['From'] = sender_email
    email_message['To'] = recipient_email
    email_message['Subject'] = subject

    # Set the message body
    if html:
        email_message.set_content(message, subtype='html')
    else:
        email_message.set_content(message)

    try:
        # Connect to the SMTP server
        smtp_connection = smtplib.SMTP(smtp_server, smtp_port)
        smtp_connection.starttls()

        # Log in to the email account
        smtp_connection.login(sender_email, sender_password)

        # Send the email
        smtp_connection.send_message(email_message)
        print("Email sent successfully!")

        # Close the connection
        smtp_connection.quit()
    except smtplib.SMTPException as e:
        print("Error: Unable to send email.")
        print(e)

if __name__ == "__main__":
    if len(sys.argv) < 8 or (len(sys.argv) == 9 and sys.argv[7] != "-f"):
        print("Usage: python script.py <smtp_server> <smtp_port> <sender_email> <sender_password> <recipient_email> <subject> <message> [-f <html_file>]")
    else:
        smtp_server = sys.argv[1]
        smtp_port = int(sys.argv[2])
        sender_email = sys.argv[3]
        sender_password = sys.argv[4]
        recipient_email = sys.argv[5]
        subject = sys.argv[6]
        if len(sys.argv) == 9:
            message = sys.argv[8]
            html = True
        else:
            message = sys.argv[7]
            html = False

        if html:
            try:
                with open(message, "r") as file:
                    message = file.read()
            except IOError as e:
                print("Error: Unable to read the HTML file.")
                sys.exit(1)

        send_email(smtp_server, smtp_port, sender_email, sender_password, recipient_email, subject, message, html)
