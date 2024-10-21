import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
load_dotenv()
import os

def read_html_template(template_path):
    try:
        with open(template_path, 'r') as file:
            html_content = file.read()
        return html_content
    except FileNotFoundError:
        print(f"Template file {template_path} not found.")
        return None

def generate_verification_link(user_id):
    # Create a local verification link with user ID as query parameters
    base_url = "http://127.0.0.1:5000"  # Assuming your app is running locally on port 5000
    verification_link = f"{base_url}/verification/verify_email/{user_id}/verify_email"
    return verification_link

def generate_password_change_link(user_id):
    # Create a local verification link with user ID as query parameters
    base_url = "http://127.0.0.1:5000"  # Assuming your app is running locally on port 5000
    verification_link = f"{base_url}/verification/change_password/{user_id}/change_password"
    return verification_link

def send_email(participant_name, to_email, user_id, verified):
    # Paths to the HTML templates
    verification_template_path = "templates/email_template.html"  # Email verification template
    password_reset_template_path = "templates/change_password.html"  # Password reset template

    smtp_server = f'{os.getenv("SMTP_SERVER")}'  # Gmail SMTP server
    smtp_port = os.getenv('EMAIL_PORT')  # Port for SSL
    smtp_user = f'{os.getenv("GMAIL_ID")}'  # Your Gmail address
    smtp_password = f'{os.getenv("GMAIL_PASSWORD")}'  # Your app-specific Gmail password

    # Choose the appropriate template and subject based on 'verified' flag
    if verified:
        # For email verification
        template_path = verification_template_path
        verification_link = generate_verification_link(user_id)
        subject = "Please verify your email address!"
    else:
        # For password reset
        template_path = password_reset_template_path
        verification_link = generate_password_change_link(user_id)  # You can change this if you need a different link
        subject = "Reset your password"

    # Read the selected HTML template
    html_template = read_html_template(template_path)
    if html_template is None:
        return None

    # Replace placeholders in the HTML template with dynamic data
    body = html_template.replace("{name}", participant_name).replace("{verification_link}", verification_link)

    try:
        # Create a multipart message
        msg = MIMEMultipart('alternative')
        msg['From'] = smtp_user
        msg['To'] = to_email
        msg['Subject'] = subject

        # Attach the HTML body with the msg instance
        msg.attach(MIMEText(body, 'html'))

        # Create a secure SSL context and send the email
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, to_email, msg.as_string())
            print(f"Email sent to {to_email} with subject '{subject}'")
            return f"Email sent to {to_email} with subject '{subject}'"

    except Exception as e:
        return f"Failed to send email to {to_email}. Error: {str(e)}"

# Example usage
# send_email("Yaashvin", "yaashvinsv@gmail.com", 12345, True)  # Email verification
# send_email("Yaashvin", "yaashvinsv@gmail.com", 12345, False)  # Password reset


# Example usage with dynamic user_id
# send_email("Yaashvin", "yaashvinsv@gmail.com", 12345, False)
# send_email("Yaashvin", "r.tarunnayaka25042005@gmail.com", 12345, False)
# send_email("Yaashvin", "r.tarunnayaka25042005@gmail.com", 12345, True)
# print("Email sent.")
