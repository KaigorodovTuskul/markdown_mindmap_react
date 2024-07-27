import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' })); 
app.use(helmet());

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


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
