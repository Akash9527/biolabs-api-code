'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">biolabs-api documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-ff01b0c191205924524c9ad1752223a4"' : 'data-target="#xs-controllers-links-module-AppModule-ff01b0c191205924524c9ad1752223a4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-ff01b0c191205924524c9ad1752223a4"' :
                                            'id="xs-controllers-links-module-AppModule-ff01b0c191205924524c9ad1752223a4"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-ff01b0c191205924524c9ad1752223a4"' : 'data-target="#xs-injectables-links-module-AppModule-ff01b0c191205924524c9ad1752223a4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-ff01b0c191205924524c9ad1752223a4"' :
                                        'id="xs-injectables-links-module-AppModule-ff01b0c191205924524c9ad1752223a4"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-e8b6f786c9722b9e9b51801d0b653309"' : 'data-target="#xs-controllers-links-module-AuthModule-e8b6f786c9722b9e9b51801d0b653309"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-e8b6f786c9722b9e9b51801d0b653309"' :
                                            'id="xs-controllers-links-module-AuthModule-e8b6f786c9722b9e9b51801d0b653309"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-e8b6f786c9722b9e9b51801d0b653309"' : 'data-target="#xs-injectables-links-module-AuthModule-e8b6f786c9722b9e9b51801d0b653309"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-e8b6f786c9722b9e9b51801d0b653309"' :
                                        'id="xs-injectables-links-module-AuthModule-e8b6f786c9722b9e9b51801d0b653309"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonModule.html" data-type="entity-link">CommonModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CommonModule-2fdbbdfbefb79f3cdfec697ed510c2f9"' : 'data-target="#xs-injectables-links-module-CommonModule-2fdbbdfbefb79f3cdfec697ed510c2f9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommonModule-2fdbbdfbefb79f3cdfec697ed510c2f9"' :
                                        'id="xs-injectables-links-module-CommonModule-2fdbbdfbefb79f3cdfec697ed510c2f9"' }>
                                        <li class="link">
                                            <a href="injectables/ExistsValidator.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ExistsValidator</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UniqueValidator.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UniqueValidator</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ConfigModule.html" data-type="entity-link">ConfigModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/FileModule.html" data-type="entity-link">FileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-FileModule-48f3873a9a060db6b67e305a8de227f5"' : 'data-target="#xs-controllers-links-module-FileModule-48f3873a9a060db6b67e305a8de227f5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-FileModule-48f3873a9a060db6b67e305a8de227f5"' :
                                            'id="xs-controllers-links-module-FileModule-48f3873a9a060db6b67e305a8de227f5"' }>
                                            <li class="link">
                                                <a href="controllers/FileController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">FileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FileModule-48f3873a9a060db6b67e305a8de227f5"' : 'data-target="#xs-injectables-links-module-FileModule-48f3873a9a060db6b67e305a8de227f5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FileModule-48f3873a9a060db6b67e305a8de227f5"' :
                                        'id="xs-injectables-links-module-FileModule-48f3873a9a060db6b67e305a8de227f5"' }>
                                        <li class="link">
                                            <a href="injectables/FileService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MasterModule.html" data-type="entity-link">MasterModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-MasterModule-91b450b0ba5578048881867c0ffca752"' : 'data-target="#xs-controllers-links-module-MasterModule-91b450b0ba5578048881867c0ffca752"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-MasterModule-91b450b0ba5578048881867c0ffca752"' :
                                            'id="xs-controllers-links-module-MasterModule-91b450b0ba5578048881867c0ffca752"' }>
                                            <li class="link">
                                                <a href="controllers/MasterController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MasterController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MasterModule-91b450b0ba5578048881867c0ffca752"' : 'data-target="#xs-injectables-links-module-MasterModule-91b450b0ba5578048881867c0ffca752"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MasterModule-91b450b0ba5578048881867c0ffca752"' :
                                        'id="xs-injectables-links-module-MasterModule-91b450b0ba5578048881867c0ffca752"' }>
                                        <li class="link">
                                            <a href="injectables/MasterService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MasterService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrderProductModule.html" data-type="entity-link">OrderProductModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-OrderProductModule-794c6be961fe3b42029cf9fc5da9720c"' : 'data-target="#xs-controllers-links-module-OrderProductModule-794c6be961fe3b42029cf9fc5da9720c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrderProductModule-794c6be961fe3b42029cf9fc5da9720c"' :
                                            'id="xs-controllers-links-module-OrderProductModule-794c6be961fe3b42029cf9fc5da9720c"' }>
                                            <li class="link">
                                                <a href="controllers/OrderProductController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">OrderProductController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-OrderProductModule-794c6be961fe3b42029cf9fc5da9720c"' : 'data-target="#xs-injectables-links-module-OrderProductModule-794c6be961fe3b42029cf9fc5da9720c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrderProductModule-794c6be961fe3b42029cf9fc5da9720c"' :
                                        'id="xs-injectables-links-module-OrderProductModule-794c6be961fe3b42029cf9fc5da9720c"' }>
                                        <li class="link">
                                            <a href="injectables/OrderProductService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>OrderProductService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ResidentCompanyModule.html" data-type="entity-link">ResidentCompanyModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ResidentCompanyModule-f51292d65db3b8995a121584529c4715"' : 'data-target="#xs-controllers-links-module-ResidentCompanyModule-f51292d65db3b8995a121584529c4715"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ResidentCompanyModule-f51292d65db3b8995a121584529c4715"' :
                                            'id="xs-controllers-links-module-ResidentCompanyModule-f51292d65db3b8995a121584529c4715"' }>
                                            <li class="link">
                                                <a href="controllers/ResidentCompanyController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ResidentCompanyController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ResidentCompanyModule-f51292d65db3b8995a121584529c4715"' : 'data-target="#xs-injectables-links-module-ResidentCompanyModule-f51292d65db3b8995a121584529c4715"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ResidentCompanyModule-f51292d65db3b8995a121584529c4715"' :
                                        'id="xs-injectables-links-module-ResidentCompanyModule-f51292d65db3b8995a121584529c4715"' }>
                                        <li class="link">
                                            <a href="injectables/ResidentCompanyService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ResidentCompanyService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SponsorModule.html" data-type="entity-link">SponsorModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SponsorModule-9277a5d4b39b82800ac8ad59f1b79900"' : 'data-target="#xs-controllers-links-module-SponsorModule-9277a5d4b39b82800ac8ad59f1b79900"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SponsorModule-9277a5d4b39b82800ac8ad59f1b79900"' :
                                            'id="xs-controllers-links-module-SponsorModule-9277a5d4b39b82800ac8ad59f1b79900"' }>
                                            <li class="link">
                                                <a href="controllers/SponsorController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SponsorController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SponsorModule-9277a5d4b39b82800ac8ad59f1b79900"' : 'data-target="#xs-injectables-links-module-SponsorModule-9277a5d4b39b82800ac8ad59f1b79900"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SponsorModule-9277a5d4b39b82800ac8ad59f1b79900"' :
                                        'id="xs-injectables-links-module-SponsorModule-9277a5d4b39b82800ac8ad59f1b79900"' }>
                                        <li class="link">
                                            <a href="injectables/SponsorService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SponsorService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-794a77fa3ad09ef49f68ebbfaf5d783f"' : 'data-target="#xs-controllers-links-module-UserModule-794a77fa3ad09ef49f68ebbfaf5d783f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-794a77fa3ad09ef49f68ebbfaf5d783f"' :
                                            'id="xs-controllers-links-module-UserModule-794a77fa3ad09ef49f68ebbfaf5d783f"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-794a77fa3ad09ef49f68ebbfaf5d783f"' : 'data-target="#xs-injectables-links-module-UserModule-794a77fa3ad09ef49f68ebbfaf5d783f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-794a77fa3ad09ef49f68ebbfaf5d783f"' :
                                        'id="xs-injectables-links-module-UserModule-794a77fa3ad09ef49f68ebbfaf5d783f"' }>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link">AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link">AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/FileController.html" data-type="entity-link">FileController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/MasterController.html" data-type="entity-link">MasterController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OrderProductController.html" data-type="entity-link">OrderProductController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ResidentCompanyController.html" data-type="entity-link">ResidentCompanyController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SponsorController.html" data-type="entity-link">SponsorController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link">UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AbstractTransformPipe.html" data-type="entity-link">AbstractTransformPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddOrderDto.html" data-type="entity-link">AddOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddResidentCompanyPayload.html" data-type="entity-link">AddResidentCompanyPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddUserPayload.html" data-type="entity-link">AddUserPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link">BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/BiolabsSource.html" data-type="entity-link">BiolabsSource</a>
                            </li>
                            <li class="link">
                                <a href="classes/BiolabsSourceFillableFields.html" data-type="entity-link">BiolabsSourceFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/Category.html" data-type="entity-link">Category</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryFillableFields.html" data-type="entity-link">CategoryFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigService.html" data-type="entity-link">ConfigService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderProductDto.html" data-type="entity-link">CreateOrderProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSponsorDto.html" data-type="entity-link">CreateSponsorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUsersTable1611484925515.html" data-type="entity-link">CreateUsersTable1611484925515</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeleteUserPayload.html" data-type="entity-link">DeleteUserPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordPayload.html" data-type="entity-link">ForgotPasswordPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/Funding.html" data-type="entity-link">Funding</a>
                            </li>
                            <li class="link">
                                <a href="classes/FundingFillableFields.html" data-type="entity-link">FundingFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/Hash.html" data-type="entity-link">Hash</a>
                            </li>
                            <li class="link">
                                <a href="classes/Invoice.html" data-type="entity-link">Invoice</a>
                            </li>
                            <li class="link">
                                <a href="classes/InvoiceFillableFields.html" data-type="entity-link">InvoiceFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListResidentCompanyPayload.html" data-type="entity-link">ListResidentCompanyPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListUserPayload.html" data-type="entity-link">ListUserPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginPayload.html" data-type="entity-link">LoginPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/Mail.html" data-type="entity-link">Mail</a>
                            </li>
                            <li class="link">
                                <a href="classes/MasterPayload.html" data-type="entity-link">MasterPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/Modality.html" data-type="entity-link">Modality</a>
                            </li>
                            <li class="link">
                                <a href="classes/ModalityFillableFields.html" data-type="entity-link">ModalityFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/Order.html" data-type="entity-link">Order</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderFillableFields.html" data-type="entity-link">OrderFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderProduct.html" data-type="entity-link">OrderProduct</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderProductFillableFields.html" data-type="entity-link">OrderProductFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordPayload.html" data-type="entity-link">PasswordPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordTransformer.html" data-type="entity-link">PasswordTransformer</a>
                            </li>
                            <li class="link">
                                <a href="classes/Product.html" data-type="entity-link">Product</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductFillableFields.html" data-type="entity-link">ProductFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterPayload.html" data-type="entity-link">RegisterPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompany.html" data-type="entity-link">ResidentCompany</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyAdvisory.html" data-type="entity-link">ResidentCompanyAdvisory</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyAdvisoryFillableFields.html" data-type="entity-link">ResidentCompanyAdvisoryFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyDocuments.html" data-type="entity-link">ResidentCompanyDocuments</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyDocumentsFillableFields.html" data-type="entity-link">ResidentCompanyDocumentsFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyFillableFields.html" data-type="entity-link">ResidentCompanyFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyHistory.html" data-type="entity-link">ResidentCompanyHistory</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyHistoryFillableFields.html" data-type="entity-link">ResidentCompanyHistoryFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyManagement.html" data-type="entity-link">ResidentCompanyManagement</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyManagementFillableFields.html" data-type="entity-link">ResidentCompanyManagementFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyTechnical.html" data-type="entity-link">ResidentCompanyTechnical</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResidentCompanyTechnicalFillableFields.html" data-type="entity-link">ResidentCompanyTechnicalFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link">Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/RoleFillableFields.html" data-type="entity-link">RoleFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/SearchResidentCompanyPayload.html" data-type="entity-link">SearchResidentCompanyPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/Site.html" data-type="entity-link">Site</a>
                            </li>
                            <li class="link">
                                <a href="classes/SiteFillableFields.html" data-type="entity-link">SiteFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/Sponsor.html" data-type="entity-link">Sponsor</a>
                            </li>
                            <li class="link">
                                <a href="classes/TechnologyStage.html" data-type="entity-link">TechnologyStage</a>
                            </li>
                            <li class="link">
                                <a href="classes/TechnologyStageFillableFields.html" data-type="entity-link">TechnologyStageFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrimStringsPipe.html" data-type="entity-link">TrimStringsPipe</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrderProductDto.html" data-type="entity-link">UpdateOrderProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResidentCompanyPayload.html" data-type="entity-link">UpdateResidentCompanyPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateResidentCompanyStatusPayload.html" data-type="entity-link">UpdateResidentCompanyStatusPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSponsorDto.html" data-type="entity-link">UpdateSponsorDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserPayload.html" data-type="entity-link">UpdateUserPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadPayload.html" data-type="entity-link">UploadPayload</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserFillableFields.html" data-type="entity-link">UserFillableFields</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserToken.html" data-type="entity-link">UserToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserTokenFillableFields.html" data-type="entity-link">UserTokenFillableFields</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link">AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExistsValidator.html" data-type="entity-link">ExistsValidator</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FileService.html" data-type="entity-link">FileService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link">JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link">JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/MasterService.html" data-type="entity-link">MasterService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrderProductService.html" data-type="entity-link">OrderProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResidentCompanyService.html" data-type="entity-link">ResidentCompanyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SchedulerService.html" data-type="entity-link">SchedulerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SponsorService.html" data-type="entity-link">SponsorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UniqueValidator.html" data-type="entity-link">UniqueValidator</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link">UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ExistsValidationArguments.html" data-type="entity-link">ExistsValidationArguments</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UniqueValidationArguments.html" data-type="entity-link">UniqueValidationArguments</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});