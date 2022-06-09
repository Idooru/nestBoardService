import { Module, forwardRef } from "@nestjs/common";
import { ValidateExistForValue } from "./validate-exist.provider";
import { BoardModule } from "../../model/board/board.module";
import { UserModule } from "../../model/user/user.module";

@Module({
  imports: [forwardRef(() => BoardModule), forwardRef(() => UserModule)],
  providers: [ValidateExistForValue],
  exports: [ValidateExistForValue],
})
export class ValidatorModule {}
