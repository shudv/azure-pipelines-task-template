import * as Chai from "chai";
import * as ChaiPromised from "chai-as-promised";
import "mocha";
Chai.use(ChaiPromised);
const expect = Chai.expect;

describe("My module", () =>
{
    it("should do what is expected", () =>
    {
        expect(1 + 1).to.equal(2);
    });
});
