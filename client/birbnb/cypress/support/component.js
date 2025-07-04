import './commands'; // si no tenés comandos personalizados, podés dejarlo vacío
import { mount } from 'cypress/react';

// Exponer mount globalmente para usar en tests
Cypress.Commands.add('mount', mount);