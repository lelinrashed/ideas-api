import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { User } from 'src/decorator/user.decorator';
import { AuthGuard } from 'src/shared/auth.gaurd';
import { ValidationPipe } from 'src/shared/validation.pipe';
import { ideaDto } from './dto/idea.dto';
import { IdeaService } from './idea.service';

@Controller('api/ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  createIdea(@User('id') userId, @Body() data: ideaDto) {
    return this.ideaService.create(userId, data);
  }

  @Get(':id')
  readIdea(@Param('id') id: string) {
    return this.ideaService.read(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  updateIdea(@Param('id') id: string, @Body() data: Partial<ideaDto>) {
    return this.ideaService.update(id, data);
  }

  @Delete('id')
  destroyIdea(@Param('id') id: string) {
    return this.ideaService.destroy(id);
  }
}
