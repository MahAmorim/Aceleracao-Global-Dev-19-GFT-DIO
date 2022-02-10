/// <reference types="cypress" />
import {
    GFTRest
} from "../support/request/GFTRest"
import {
    GFTServer
} from "../support/request/GFTServer"

//@ - simboliza uma tag
describe('@users - Users CRUD', () => {

    const gftRest = new GFTRest()
    const gftServer = new GFTServer()

    context('Functionality', () => {

        //@sprintXX @JIRA-XXXX - formas de criar identificador dentro de um projeto

        it('POST - Create an user', () => {
            cy.gftFixture("userGft")
            cy.get("@body").then((body) => {
                body.login = 'Agapito Grayson'
                body.full_name = 'Robson Agapito Grayson'
                body.email = "asa.noturna@gft.com"
                body.age = 30

                gftRest.executePost(gftServer.getURLUsers(), body).should(({
                    status,
                    body
                }) => {
                    gftRest.logResponse(status, body)
                    expect(status).to.eq(201)
                })
            })
        })

        it('GET - Get all users', () => {
            gftRest.executeGet(gftServer.getURLUsers()).should(({
                status,
                body
            }) => {

                gftRest.logResponse(status, body)

                expect(status).to.eq(200)
            })
        })

        it('GET - Get an user', () => {
            cy.createPatternUser("spiderman", "Felipe Parker", "spiderman@gft.com", "22")
            cy.get('@body').then((bodyAux) => {

                gftRest.executeGet(gftServer.getURLUsers() + '/' + bodyAux.id).should(({
                    status,
                    body
                }) => {

                    gftRest.logResponse(status, body)

                    expect(body.id).to.eq(bodyAux.id)
                    expect(body.login).to.eq("spiderman")
                    expect(body.full_name).to.eq("Felipe Parker")
                    expect(body.email).to.eq("spiderman@gft.com")
                    expect(body.age).to.eq(22)
                    expect(status).to.eq(200)

                    expect(body.created_at).to.be.exist
                    expect(body.updated_at).to.be.exist


                })
            })
        })

        it('PUT - Update an user', () => {
            cy.createPatternUser("superman", "Vinicius Kent", "superman@gft.com", "22")
            cy.get('@body').then((bodyAux) => {
                bodyAux.age = 28
                gftRest.executePut(gftServer.getURLUsers() + '/' + bodyAux.id, bodyPut).should(({
                    status,
                    body
                }) => {

                    gftRest.logResponse(status, body)
                    expect(status).to.eq(200)

                    gftRest.executeGet(gftServer.getURLUsers() + '/' + bodyAux.id).should(({
                        status,
                        body
                    }) => {

                        expect(body.id).to.eq(bodyAux.id)
                        expect(body.login).to.eq("superman")
                        expect(body.full_name).to.eq("Vinicius Kent")
                        expect(body.email).to.eq("superman@gft.com")
                        expect(body.age).to.eq(28)

                        expect(body.created_at).to.be.exist
                        expect(body.updated_at).to.be.exist


                    })
                })
            })
        })

        it('DELETE - Delete an user', () => {
            cy.createPatternUser("wonderwoman", "Diana Ferreira", "wonderwoman@gft.com", "21")
            cy.get('@body').then((bodyAux) => {
                gftRest.executeDelete(gftServer.getURLUsers() + '/' + bodyAux.id).should(({
                    status,
                    body
                }) => {
                    gftRest.logResponse(status, body)
                    expect(status).to.eq(204)

                    gftRest.executeGet(gftServer.getURLUsers() + '/' + bodyAux.id).should(({
                        status
                    }) => {
                        expect(body.error).to.eq('Not Found')
                        expect(status).to.eq(404)
                    })
                })
            })
        })

        it('PATCH - Update an user', () => {
            cy.createPatternUser("catwoman", "Selina Silva", "catwoman@gft.com", "25")
            cy.get('@body').then((bodyAux) => {
                bodyAux.login = "cat"

                gftRest.executePatch(gftServer.getURLUsers() + '/' + bodyAux.id, bodyAux).should(({
                    status,
                    body
                }) => {
                    gftRest.logResponse(status, body)
                    expect(status).to.eq(200)

                    gftRest.executeGet(gftServer.getURLUsers() + '/' + bodyAux.id).should(({
                        body
                    }) => {
                        expect(body.id).to.eq(bodyAux.id)
                        expect(body.login).to.eq("cat")
                        expect(body.full_name).to.eq("Selina Silva")
                        expect(body.email).to.eq("catwoman@gft.com")
                        expect(body.age).to.eq(25)
                        expect(body.created_at).to.be.exist
                        expect(body.updated_at).to.be.exist
                    })
                })
            })
        })

    })

    context('Architecture', () => {
        it('Verify contract', () => {
            cy.createPatternUser("spiderman", "Felipe Parker", "spiderman@gft.com", "22")
            cy.get('@body').then((bodyAux) => {
                gftRest.executeGet(gftServer.getURLUsers() + '/' + bodyAux.id).should(({
                    status,
                    body
                }) => {
                    gftRest.logResponse(status, body)

                    cy.validateContract('user.contract', body)
                })
            })
        })
    })
})