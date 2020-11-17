"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const broccoli_test_helper_1 = require("broccoli-test-helper");
const chai_1 = require("chai");
// tslint:disable:no-var-requires
const Fixturify = require("broccoli-fixturify");
const multidep = require('multidep');
// tslint:enable:no-var-requires
const multidepRequire = multidep('tests/multidep.json');
describe("buildOutput", () => {
    let fixture;
    let subject;
    multidepRequire.forEachVersion('broccoli', (version, broccoli) => {
        describe(version, () => {
            beforeEach(() => __awaiter(this, void 0, void 0, function* () {
                fixture = {
                    "hello.txt": "hello world",
                    lib: {
                        "more.txt": "even more",
                    },
                };
                const outputNode = new Fixturify(fixture);
                const Builder = broccoli.Builder;
                subject = broccoli_test_helper_1.fromBuilder(new Builder(outputNode));
            }));
            afterEach(() => subject.dispose());
            it("should support read", () => __awaiter(this, void 0, void 0, function* () {
                chai_1.expect(subject.read()).to.deep.equal({});
                yield subject.build();
                chai_1.expect(subject.read()).to.deep.equal({
                    "hello.txt": "hello world",
                    lib: {
                        "more.txt": "even more",
                    },
                });
                chai_1.expect(subject.read("lib")).to.deep.equal({
                    "more.txt": "even more",
                });
            }));
            it("should support changes on build and rebuild", () => __awaiter(this, void 0, void 0, function* () {
                chai_1.expect(subject.changes()).to.deep.equal({});
                yield subject.build();
                chai_1.expect(subject.changes()).to.deep.equal({
                    "hello.txt": "create",
                    "lib/": "mkdir",
                    "lib/more.txt": "create",
                });
                fixture["hello.txt"] = "goodbye";
                // tslint:disable-next-line no-string-literal
                fixture["lib"] = null;
                yield subject.build();
                chai_1.expect(subject.changes()).to.deep.equal({
                    "lib/more.txt": "unlink",
                    // tslint:disable-next-line object-literal-sort-keys
                    "lib/": "rmdir",
                    "hello.txt": "change",
                });
                chai_1.expect(subject.read()).to.deep.equal({
                    "hello.txt": "goodbye",
                });
            }));
            it("support cleanup builder on dispose", () => __awaiter(this, void 0, void 0, function* () {
                yield subject.dispose();
                // output path is gone
                chai_1.expect(() => subject.read()).to.throw(/ENOENT/);
            }));
        });
    });
});
//# sourceMappingURL=build_output_test.js.map