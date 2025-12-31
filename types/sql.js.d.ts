declare module 'sql.js' {
  export interface Database {
    run(sql: string, params?: any[]): void
    exec(sql: string): Array<{ columns: string[]; values: any[][] }>
    prepare(sql: string): Statement
    close(): void
    export(): Uint8Array
    getRowsModified(): number
  }

  export interface Statement {
    bind(params: any[]): void
    step(): boolean
    get(): any[]
    getAsObject(): any
    free(): void
  }

  export default function initSqlJs(config?: {
    locateFile?: (file: string) => string
  }): Promise<{
    Database: new (data?: Uint8Array) => Database
  }>
}

