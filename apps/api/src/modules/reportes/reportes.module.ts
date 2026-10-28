import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Protagonista, Educador } from '../personas/entities/persona.entity';
import { CampamentoParticipante } from '../campamentos/entities/campamento-participante.entity';
import { Movimiento } from '../movimientos/entities/movimiento.entity';
import { Inscripcion } from '../inscripciones/entities/inscripcion.entity';
import { Caja } from '../cajas/entities/caja.entity';
import { MovimientosModule } from '../movimientos/movimientos.module';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Protagonista,
      Educador,
      CampamentoParticipante,
      Movimiento,
      Inscripcion,
      Caja,
    ]),
    MovimientosModule,
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
