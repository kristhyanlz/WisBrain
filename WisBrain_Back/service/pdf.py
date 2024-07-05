from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, PageBreak

def generate_pdf(dni, nombres_apellidos, fecha_test, resultados, observaciones, movimientos):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    title = Paragraph("Resumen", styles['Title'])
    elements.append(title)
    elements.append(Paragraph("<br/>", styles['Normal']))

    # Header Info
    header_data = [
        [nombres_apellidos, dni, fecha_test]
    ]
    header_table = Table(header_data)
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.white),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
    ]))
    elements.append(header_table)
    elements.append(Paragraph("<br/><br/>", styles['Normal']))

    # Results Table
    table_data = [
        ['Descripción', 'Resultado'],
        ['Número de categorías correctas', resultados['num_cat_correctas']],
        ['Número de errores perseverativos', resultados['num_err_perseverativos']],
        ['Número de errores NO perseverativos', resultados['num_err_no_perseverativos']],
        ['Número total de errores', resultados['num_total_errores']],
        ['Porcentaje de errores de perseverativos', f"{resultados['porcentaje_errores_perseverativos']}%"],
        ['Rendimiento cognitivo', resultados['rendimiento_cognitivo']],
        ['Flexibilidad cognitiva', resultados['flexibilidad_cognitiva']],
    ]
    table = Table(table_data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(table)
    elements.append(Paragraph("<br/><br/>", styles['Normal']))

    # Observations
    observations_title = Paragraph("Observaciones y comentarios:", styles['Heading2'])
    elements.append(observations_title)
    elements.append(Paragraph(observaciones, styles['Normal']))

    # New Page for Movements
    elements.append(PageBreak())
    movements_title = Paragraph("Historial de movimientos", styles['Title'])
    elements.append(movements_title)
    elements.append(Paragraph("<br/>", styles['Normal']))

    # Movements Table
    movements_data = [['# Tarjeta', 'Respuesta', 'Categoría']]
    for i, mov in enumerate(movimientos, start=1):
        color = colors.red if mov['respuesta'] == 'INCORRECTO' else colors.black
        movements_data.append([i, Paragraph(f'<font color="{color}">{mov["respuesta"]}</font>', styles['Normal']), mov['categoria']])

    movements_table = Table(movements_data)
    movements_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(movements_table)

    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer