import { Role } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";
import { AppError } from "../middleware/error.middleware";
import { RegisterInput, LoginInput } from "../validators/auth.validator";

export const authService = {
  async register(input: RegisterInput) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError("An account with this email already exists.", 409);
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    // Create user
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role as Role,
    });

    // Generate token
    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },

  async login(input: LoginInput) {
    // Find user
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError("Invalid email or password.", 401);
    }

    // Compare password
    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid email or password.", 401);
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    };
  },
};
