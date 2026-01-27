from app.ai.classifier import classify_email
from app.ai.responder import generate_email_response

if __name__ == "__main__":
    email_text = """
        E ai vei blz? 
    """

    classification = classify_email(email_text)
    reply = generate_email_response(email_text, classification)

    print(classification)
    print(reply)