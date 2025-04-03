package vn.com.kltn_project_v1.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.awt.print.Printable;
import java.awt.print.PrinterException;
import java.awt.print.PrinterJob;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.Base64;

public class QRCodeGenerator {

    public static String generateQRCode(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = image.createGraphics();
        graphics.setColor(Color.WHITE);
        graphics.fillRect(0, 0, width, height);
        graphics.setColor(Color.BLACK);

        for (int x = 0; x < width; x++) {
            for (int y = 0; y < height; y++) {
                if (bitMatrix.get(x, y)) {
                    graphics.fillRect(x, y, 1, 1);
                }
            }
        }
        graphics.dispose();

        // Chuyển thành Base64 để gửi lên frontend
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        return Base64.getEncoder().encodeToString(imageBytes);
    }
    public static void printQRCodeFromBase64(String base64QRCode) throws IOException, PrinterException {
        byte[] imageBytes = Base64.getDecoder().decode(base64QRCode);
        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
        BufferedImage image = ImageIO.read(bis);

        PrinterJob printerJob = PrinterJob.getPrinterJob();
        printerJob.setPrintable((graphics, pageFormat, pageIndex) -> {
            if (pageIndex > 0) {
                return Printable.NO_SUCH_PAGE;
            }
            Graphics2D g2d = (Graphics2D) graphics;
            g2d.drawImage(image, 100, 100, null);
            return Printable.PAGE_EXISTS;
        });

        if (printerJob.printDialog()) {
            printerJob.print();
        }
    }
    public static String saveQRCodeToPDF(String base64QRCode, String fileName) throws IOException {
        // Giải mã Base64 thành ảnh
        byte[] imageBytes = Base64.getDecoder().decode(base64QRCode);
        ByteArrayInputStream bis = new ByteArrayInputStream(imageBytes);
        BufferedImage qrImage = ImageIO.read(bis);

        // Đường dẫn lưu file PDF
        String dirPath = System.getProperty("user.dir") + "/QRCodeFiles/";
        File dir = new File(System.getProperty("user.dir") + "/QRCodeFiles/");
        if (!dir.exists()) {
            if (!dir.mkdirs()) {
                throw new IOException("Không thể tạo thư mục: " + dir.getAbsolutePath());
            }
        }
        String pdfPath = dirPath + fileName;
        // Tạo tài liệu PDF
        PdfWriter writer = new PdfWriter(pdfPath);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Chuyển BufferedImage thành iText Image
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "png", baos);
        ImageData imageData = ImageDataFactory.create(baos.toByteArray());
        Image qrCodeImage = new Image(imageData);

        // Thêm ảnh QR vào PDF
        PdfFont boldFont = PdfFontFactory.createFont(StandardFonts.HELVETICA_BOLD);
        document.add(new Paragraph("Room QR Code").setFont(boldFont).setFontSize(16));
        document.add(qrCodeImage.setAutoScale(true));
        File pdfFile = new File(pdfPath);
        document.close();
        return pdfPath;
    }
}
