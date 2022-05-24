// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from "@nestjs/common";
// import { Observable } from "rxjs";
// import { map } from "rxjs/operators";

// @Injectable()
// export class JsonInterceptor implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> {
//     return next.handle().pipe(
//       map(() => ({
//         success: true,
//         data,
//       })),
//     );
//   }
// }
// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from "@nestjs/common";
// import { Observable } from "rxjs";
// import { map } from "rxjs/operators";
// import { Response } from "express";

// @Injectable()
// export class LoggingInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     console.log("Before...");

//     return next.handle().pipe(map((data) => console.log(data)));
//   }
// }
