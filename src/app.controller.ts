import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('test')
@Controller('test')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Return hello message.' })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello11')
  @ApiOperation({ summary: 'Get alternative hello message' })
  @ApiResponse({ status: 200, description: 'Return alternative hello message.' })
  getHello11(): string {
    return this.appService.getHello11();
  }
}