var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { McpApp, Module, ConfigModule } from '@nitrostack/core';
import { ResearchModule } from './modules/research.module.js';
/**
 * Root Application Module
 *
 * AI-Powered Competitive Research Assistant MCP Server.
 */
let AppModule = class AppModule {
};
AppModule = __decorate([
    McpApp({
        module: AppModule,
        server: {
            name: 'competitive-research-assistant',
            version: '1.0.0'
        },
        logging: {
            level: 'error'
        }
    }),
    Module({
        name: 'research-assistant',
        description: 'AI-Powered Competitive Research Assistant',
        imports: [
            ConfigModule.forRoot(),
            ResearchModule
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map