from io import BytesIO
from reportlab.pdfgen import canvas

def generate_pdf():
    buffer = BytesIO()
    c = canvas.Canvas(buffer)
    c.drawString(100, 750, "¡Hola, mundo!")


    c.save()
    buffer.seek(0)
    return buffer