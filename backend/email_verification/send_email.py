import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def read_html_template(template_path):
    try:
        with open(template_path, 'r') as file:
            html_content = file.read()
        return html_content
    except FileNotFoundError:
        print(f"Template file {template_path} not found.")
        return None

def generate_verification_link(to_email, user_id):
    # Create a local verification link with email and user ID as query parameters
    base_url = "http://localhost:5000/"  # Assuming your app is running locally on port 5000
    verification_link = f"{base_url}uirfeh/{to_email}/uhedu/{user_id}/verify?/id_email={user_id}&{to_email}"
    return verification_link

def send_email(participant_name, to_email, user_id, template_path):
    smtp_server = 'smtp.gmail.com'  # Gmail SMTP server
    smtp_port = 465  # Port for SSL
    smtp_user = 'walkezwalk@gmail.com'  # Your Gmail address
    smtp_password = 'aove gqwi ardd kobt'  # Your app-specific Gmail password (not real for security reasons)

    # Generate the dynamic verification link
    verification_link = generate_verification_link(to_email, user_id)
    
    # Read the HTML template
    html_template = read_html_template(template_path)
    if html_template is None:
        return
    
    # Replace placeholders in the HTML template with dynamic data
    body = html_template.replace("{name}", participant_name).replace("{verification_link}", verification_link)
    subject = "Please verify your email address!"

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
            print(f"Verification email sent to {to_email}")

    except Exception as e:
        print(f"Failed to send email to {to_email}. Error: {str(e)}")

# Example usage with dynamic user_id
send_email("Yaashvin", "yaashvinsv@gmail.com", 12345, "email_template.html")
send_email("Srujan", "kashyapsrujan12@gmail.com", 12345, "email_template.html")
print("Email sent.")
