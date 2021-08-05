import { Test } from "@nestjs/testing";
import { PasswordTransformer } from "../user/password.transformer";

describe('PasswordTransformer', () => {
    let passwordTransformer;
    let plainText = "Password";
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                PasswordTransformer,
            ]
        }).compile();

        passwordTransformer = await module.get<PasswordTransformer>(PasswordTransformer);
    });

    it('should be defined', () => {
        expect(passwordTransformer).toBeDefined();
    });

    describe('should test to() method', () => {
      
        it('it should return encrypted string if it has value', async () => {
            let password = await passwordTransformer.to(plainText);
            expect(password).not.toBeNull();
        });

        it('it should return encrypted string if it is null', async () => {
            let password = await passwordTransformer.to(null);
            expect(password).toBeNull;
        });
    });

    describe('should test from() method', () => {
      
        it('it should return encrypted string', async () => {
            let password = await passwordTransformer.from(plainText);
            expect(password).not.toBeNull();
        });
    });
});