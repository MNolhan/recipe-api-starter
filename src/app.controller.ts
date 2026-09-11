import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {

  @Public()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Health check successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Health check failed' })
  @Get()
  healthCheck(): { status: string } {
    return { status: 'Avec ApiKEY : http://localhost:3000/api/recipe -- Sans ApiKEY : http://localhost:3000/api/auth/register'  };
  }
}
