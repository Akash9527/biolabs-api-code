import { Test } from "@nestjs/testing";
import { Hash } from "../utils/Hash";

describe('Hash', () => {
    let hash;
    let plainText = "Password";
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                Hash,
            ]
        }).compile();

        hash = await module.get<Hash>(Hash);
    });

    it('should be defined', () => {
        expect(hash).toBeDefined();
    });

    describe('should test make/compare method', () => {
      
        it('it should return encrypted string', async () => {
            let password = await Hash.make(plainText);
            expect(password).not.toBeNull();
        });

        it('it should compare the encrypted string and the plain string ', async () => {
            let encryptedString = await Hash.make(plainText);
            let trueResult = await Hash.compare(plainText, encryptedString);
            expect(trueResult).not.toBeNull();
        });
    });
});