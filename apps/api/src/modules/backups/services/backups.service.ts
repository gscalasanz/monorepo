import { gzipSync } from 'zlib';

import { Injectable } from '@nestjs/common';
import { formatInBsAs, instantOf, nowDate } from '@scout/shared/time';

import { FILENAME_TIMESTAMP_PATTERN } from '../../../common/constants';

import { SqlDataExportService } from './sql-data-export.service';

@Injectable()
export class BackupsService {
  constructor(private readonly sqlDataExportService: SqlDataExportService) {}

  /** Nombre con fecha y hora de BsAs (no de la zona del servidor). */
  generateFilename(now: Date = nowDate()): string {
    const stamp = formatInBsAs(instantOf(now), FILENAME_TIMESTAMP_PATTERN);
    return `scout-backup-${stamp}.sql.gz`;
  }

  async generateBackup(): Promise<Buffer> {
    const sql = await this.sqlDataExportService.generateDump();
    return gzipSync(Buffer.from(sql, 'utf8'));
  }
}
