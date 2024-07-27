import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

// Подключаем dotenv в начале файла
dotenv.config();

const app = express();
const port = 3001;

const corsOptions = {
    origin: process.env.DOMAIN_NAME, // Замените на ваш фронтенд URL
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); // Увеличение лимита для JSON тела запроса

const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.YANDEX_EMAIL,
    pass: process.env.YANDEX_PASSWORD,
  },
});

app.post('/send-email', async (req, res) => {
  const { email, subject, textContent, pngBase64, txtContent } = req.body;

  const mailOptions = {
    from: process.env.YANDEX_EMAIL,
    to: email,
    subject,
    text: textContent,
    attachments: [
      {
        filename: 'markmap.png',
        content: pngBase64.split('base64,')[1],
        encoding: 'base64',
      },
      {
        filename: 'markmap.txt',
        content: txtContent,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
