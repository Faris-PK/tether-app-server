import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import jwt from 'jsonwebtoken';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export class GoogleAuthController {
  constructor(private userRepository: UserRepository) {}

  async googleLogin(req: Request, res: Response) {
    const { token } = req.body;

    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return res.status(400).json({ message: 'Invalid token' });
      }

      const { email, name, sub } = payload;

      let user = await this.userRepository.findByEmail(email!);

      if (!user) {
        const newUser = new User({
          username: name,
          email: email!,
          googleId: sub,
          password: '', 
        });
        user = await this.userRepository.save(newUser);
      }

      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_ACCESS_SECRET as string,
        { expiresIn: '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_REFRESH_SECRET as string,
        { expiresIn: '7d' }
      );

      res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

      return res.status(200).json({ user, message: 'Google login successful' });
    } catch (error) {
      console.error('Google login error:', error);
      return res.status(500).json({ message: 'An error occurred during Google login' });
    }
  }
}