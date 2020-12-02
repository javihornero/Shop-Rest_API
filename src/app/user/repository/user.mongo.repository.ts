import { UserRepository } from './user.repository';
import { Model } from 'mongoose';
import { UserSchema } from './user.schema';
import { User } from '../user.model';
import { Service } from 'typedi';
import { InstanceType } from 'typegoose';

@Service()
export class UserMongoRepository implements UserRepository {
  
  
  private userModel: Model<InstanceType<UserSchema>>;

  constructor() {
    this.userModel = new UserSchema().getModelForClass(
      UserSchema,
      { schemaOptions: { collection: 'users' } }
    );

  }


  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email: email });
  }


  async create(user: User): Promise<User> {

    const userObj = new this.userModel(user);

    return await userObj.save();
  }

  async update(user: User): Promise<User | null> {
    const updateDoc = {
      $set: user
    };

    const updateResult = await this.userModel.updateOne({_id:user.id}, updateDoc).exec();

    if (user.id && updateResult && updateResult.nModified === 1) {
      return await this.findById(user.id);
    }

    return null;
  }

  async findById(userId: string): Promise<User | null> {
    return await this.userModel.findById(userId);
  } 

  async findAll(): Promise<Array<User>> {
    return await this.userModel.find().exec();
  }

  async delete(userId: string): Promise<null> {
    const {
      ok, n
    } = await this.userModel.deleteOne({_id: userId});

    return null;
  }

}