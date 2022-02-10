/// <reference types="Cypress" />

export class GFTServer {

    constructor() {
        this.url = `http://agapito-server.herokuapp.com`;
    }

    getURLUsers = () => this.url + '/users';
}