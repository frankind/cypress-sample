/// <reference types="Cypress" />
describe('Test Agoda Search XHR', () => {
  beforeEach(() => {
    cy.server()
    cy.route('POST', 'https://www.agoda.com/api/en-us/Recommended/GetTopDestinations').as('main')
    cy.route('POST', 'https://www.agoda.com/api/en-us/Main/SendSearchRenderMessage').as(
      'searchRender'
    )
    cy.route(
      'GET',
      'https://www.agoda.com/Search/Search/GetUnifiedSuggestResult/3/1/1/0/en-us/?searchText=Bangkok*'
    ).as('searchBangkok')
  })
  it('Get XHR Request and Response', () => {
    cy.visit('/')
    cy.wait('@main')
    cy.get('[data-selenium="textInput"]').click()
    cy.wait('@searchRender').then((xhr) => {
      const req = xhr.request.body
      expect(req.SearchTerm).to.be.equal('')
    })
    cy.get('[data-selenium="textInput"]').type('Bangkok')
    cy.wait('@searchBangkok').then((xhr) => {
      const resp = xhr.response.body
      expect(resp.ViewModelList[0].Name).to.be.equal('Bangkok')
    })
  })
})
