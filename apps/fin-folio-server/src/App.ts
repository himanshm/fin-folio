import { AppDataSource } from './data-source';
import { User } from './models/User';

class Application {
  async main() {
    await AppDataSource.initialize();

    // Test: Create a new user
    const user = new User();
    user.name = 'Temba';
    user.email = 'lauren-bell@noemail.com';
    user.password = 'lauren@123';
    user.country = 'UK';
    user.currency = 'GBP';

    try {
      // const newUser = await AppDataSource.manager.save(user);
      // console.log('New user: ', newUser);
      // console.log('User created successfully');
      const lastUser = await AppDataSource.manager.findOneBy(User, {
        email: 'lauren-bell@noemail.com'
      });
      const isPasswordValid = await lastUser?.isPasswordValid('lauren@1234');
      console.log('Is password valid: ', isPasswordValid);
    } catch (error) {
      console.error(error);
    }
  }
}

export default Application;
