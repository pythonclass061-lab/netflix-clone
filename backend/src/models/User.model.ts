import db from '../config/database';
import bcrypt from 'bcryptjs';

class UserModel {
  async findOne(query: any): Promise<any> {
    return await db.users.findOne(query);
  }

  async findById(id: string): Promise<any> {
    return await db.users.findOne({ _id: id });
  }

  async create(userData: any): Promise<any> {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const user = {
      ...userData,
      password: hashedPassword,
      subscription: { plan: 'standard', status: 'inactive', startDate: null, endDate: null, autoRenew: true },
      paymentMethods: [],
      watchlist: [],
      continueWatching: [],
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return await db.users.insert(user);
  }

  async findByIdAndUpdate(id: string, update: any): Promise<any> {
    await db.users.update({ _id: id }, { $set: update });
    return await db.users.findOne({ _id: id });
  }
}

export const User = new UserModel();
