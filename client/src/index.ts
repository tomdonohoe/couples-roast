import { io } from "socket.io-client";
const socket = io();

import { Game } from './common/Game';

import { initialiseGameHandlers } from './handlers/game.handlers';

const game: Game = new Game();

document.addEventListener("DOMContentLoaded", () => {

    initialiseGameHandlers(game, socket);

});