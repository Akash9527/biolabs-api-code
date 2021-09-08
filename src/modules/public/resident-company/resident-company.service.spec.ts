import { Repository, SelectQueryBuilder } from "typeorm";
import { ResidentCompany } from "./resident-company.entity";
import { ResidentCompanyService } from "./resident-company.service";
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PassportModule } from "@nestjs/passport";
import { ResidentCompanyHistory } from "./resident-company-history.entity";
import { ResidentCompanyDocuments, ResidentCompanyDocumentsFillableFields } from "./rc-documents.entity";
import { ResidentCompanyAdvisory, ResidentCompanyAdvisoryFillableFields } from "./rc-advisory.entity";
import { ResidentCompanyManagement, ResidentCompanyManagementFillableFields } from "./rc-management.entity";
import { ResidentCompanyTechnical, ResidentCompanyTechnicalFillableFields } from "./rc-technical.entity";
import { Site } from "../master/site.entity";
import { BiolabsSource } from "../master/biolabs-source.entity";
import { Category } from "../master/category.entity";
import { Funding } from "../master/funding.entity";
import { Modality } from "../master/modality.entity";
import { TechnologyStage } from "../master/technology-stage.entity";
import { User } from "../user/user.entity";
import { Notes } from "./rc-notes.entity";
import { Mail } from '../../../utils/Mail';
import { AddResidentCompanyPayload } from './add-resident-company.payload';
import { ListResidentCompanyPayload } from './list-resident-company.payload';
import { SearchResidentCompanyPayload } from './search-resident-company.payload';
import { UpdateResidentCompanyStatusPayload } from './update-resident-company-status.payload';
import { AddNotesDto } from "./add-notes.dto";
import { UpdateResidentCompanyPayload } from "./update-resident-company.payload";
import { Item } from "../entity/item.entity";
import { SpaceChangeWaitlist } from "../entity/space-change-waitlist.entity";
import { ProductType } from "../order/model/product-type.entity";
import { ProductTypeService } from "../order/product-type.service";
import { UpdateWaitlistPriorityOrderDto } from "../dto/update-waitlist-priority-order.dto";
import { UpdateWaitlistRequestStatusDto } from "../dto/update-waitlist-request-status.dto";
import { UpdateSpaceChangeWaitlistDto } from "../dto/update-space-change-waitlist.dto";
import { AddSpaceChangeWaitlistDto } from "../dto/add-space-change-waitlist.dto";
import { NotAcceptableException } from "@nestjs/common";
import { UpdateNotesDto } from "./update-notes.dto";
import { ApplicationConstants } from "../../../utils/application-constants";
import { EmailFrequency } from "../enum/email-frequency-enum";
const { InternalException, HttpException, BiolabsException } = require('../../common/exception/biolabs-error');
const mockCompany: any = { id: 1 };
const mockAddResidentCompany: AddResidentCompanyPayload = {
  name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
  technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
  otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
  otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
  utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
  preferredMoveIn: 1, otherIndustries: {}, otherModality: {}, sitesApplied: [2], primarySite: [1],"selectionDate":new Date("2021-07-14")
}
const listRCPayload: ListResidentCompanyPayload = {
  q: "test", role: 1, pagination: true, page: 3, limit: 3, companyStatus: '1', committeeStatus: '1', companyVisibility: true,
  companyOnboardingStatus: true, sort: true, sortFiled: "", sortOrder: "", sortBy: ""
}

const mockRC: ResidentCompany = {
  id: 1, name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
  technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
  otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
  otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
  utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
  preferredMoveIn: 1, otherIndustries: {}, otherModality: {}, "status": "1", companySize: 20,
  "companyStatus": "1",
  "companyVisibility": true,
  "companyOnboardingStatus": true,
  "elevatorPitch": null,
  "logoOnWall": null,
  "logoOnLicensedSpace": null,
  "bioLabsAssistanceNeeded": null,
  "technologyPapersPublished": null,
  "technologyPapersPublishedLinkCount": null,
  "technologyPapersPublishedLink": null,
  "patentsFiledGranted": null,
  "patentsFiledGrantedDetails": null,
  "foundersBusinessIndustryBefore": null,
  "academiaPartnerships": null,
  "academiaPartnershipDetails": null,
  "industryPartnerships": null,
  "industryPartnershipsDetails": null,
  "newsletters": null,
  "shareYourProfile": false,
  "website": null,
  "foundersBusinessIndustryName": null,
  "createdAt": 2021,
  "updatedAt": 2021,
  "pitchdeck": "pitchDeck.img",
  "logoImgUrl": "logoimgurl.img",
  "committeeStatus": null,
  "selectionDate": new Date("2021-07-05T18:30:00.000Z"),
  "companyStatusChangeDate": 2021,
  sitesApplied: [2],
  primarySite: [1],
  companyOnboardingDate: 0
}

let mockUpdateSpaceChangeWaitlistDto: UpdateSpaceChangeWaitlistDto = {
  spaceChangeWaitlistId: 1,
  requestStatus: 0,
  isRequestInternal: true,
  membershipChange: 0,
  graduateDescription: "graduated",
  desiredStartDate: 1627603200,
  items: [
    {
      itemName: 'Private Office',
      currentQty: 12,
      productTypeId: 4,
      desiredQty: 12
    },
    {
      itemName: 'Workstation',
      currentQty: 7,
      productTypeId: 3,
      desiredQty: 12
    },
    {
      itemName: 'Private Lab',
      currentQty: 8,
      productTypeId: 5,
      desiredQty: 20
    },

    {
      itemName: 'Membership Fee',
      currentQty: 10,
      productTypeId: 1,
      desiredQty: 32
    },

  ],
  planChangeSummary: "See Notes",
  fulfilledOn: 0,
  requestNotes: 'This is notes1',
  funding: '12',
  siteNotes: '', companyStage: 3,
  companySize: 120,
  fundingSource: [1, 2],
  internalNotes: '',
  shareYourProfile: true,
  requestGraduateDate: 946665000,
  marketPlace: true
}
let mockSpaceChangeWaitlistItem: any = {
  id: 1,
  dateRequested: 2021,
  desiredStartDate: 1632614400,
  planChangeSummary: '',
  requestedBy: 'BiolabsNewvision',
  requestStatus: 0,
  fulfilledOn: 946665000,
  isRequestInternal: true,
  requestNotes: 'Require more Private Lab, Workstation, Lab Bench',
  internalNotes: '',
  siteNotes: '',
  priorityOrder: 6,
  site: [2],
  membershipChange: 0,
  requestGraduateDate: 946665000,
  marketPlace: true,
  createdAt: 2021,
  updatedAt: 2021,
  residentCompany: mockRC,
  items: [
    {
      id: 1,
      spaceChangeWaitlist_id: 121,
      productTypeId: 5,
      itemName: 'Private Lab',
      currentQty: 5,
      desiredQty: 7,
      createdAt: 2021,
      updatedAt: 2021
    },
    {
      id: 2,
      spaceChangeWaitlist_id: 121,
      productTypeId: 2,
      itemName: 'Lab Bench',
      currentQty: -2,
      desiredQty: null,
      createdAt: 2021,
      updatedAt: 2021
    },
    {
      id: 3,
      spaceChangeWaitlist_id: 121,
      productTypeId: 3,
      itemName: 'Workstation',
      currentQty: 4,
      desiredQty: 3,
      createdAt: 2021,
      updatedAt: 2021
    },
    {
      id: 4,
      spaceChangeWaitlist_id: 121,
      productTypeId: 4,
      itemName: 'Private Office',
      currentQty: 2,
      desiredQty: null,
      createdAt: 2021,
      updatedAt: 2021
    },
    {
      id: 5,
      spaceChangeWaitlist_id: 121,
      productTypeId: 4,
      itemName: 'Private Office',
      currentQty: 5,
      desiredQty: null,
      createdAt: 2021,
      updatedAt: 2021
    },
    {
      id: 6,
      spaceChangeWaitlist_id: 121,
      productTypeId: 1,
      itemName: 'Membership Fee',
      currentQty: 4,
      desiredQty: null,
      createdAt: 2021,
      updatedAt: 2021
    }
  ]
}
const mockResidentHistory: ResidentCompanyHistory = {
  id: 1, name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
  technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
  otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "",
  otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
  utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
  preferredMoveIn: 1, otherIndustries: {}, otherModality: {}, "status": "1", companySize: 20,
  companyStatus: "1", companyVisibility: true, companyOnboardingStatus: true, elevatorPitch: null, logoOnWall: null,
  logoOnLicensedSpace: null, bioLabsAssistanceNeeded: null, technologyPapersPublished: null,
  technologyPapersPublishedLinkCount: null, technologyPapersPublishedLink: null, patentsFiledGranted: null,
  patentsFiledGrantedDetails: null, foundersBusinessIndustryBefore: null, academiaPartnerships: null,
  academiaPartnershipDetails: null, industryPartnerships: null, industryPartnershipsDetails: null,
  newsletters: null, shareYourProfile: null, website: null, foundersBusinessIndustryName: null,
  createdAt: 2021, updatedAt: 2021, pitchdeck: "pitchDeck.img", logoImgUrl: "logoimgurl.img",
  committeeStatus: '1', selectionDate: new Date("2021-07-05T18:30:00.000Z"), companyStatusChangeDate: 2021, comnpanyId: 1, intellectualProperty: null,
  sitesApplied: [2], primarySite: [1], companyOnboardingDate: 1626134400
}
const mockResidentDocument: ResidentCompanyDocuments = {
  id: 1, company_id: 1, doc_type: "Document", name: "ResidentDocument",
  link: "residentDocumentLink", status: '1', createdAt: 2021, updatedAt: 2021
}
const mockResidentManagement: ResidentCompanyManagement = {
  id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
  title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
  academicAffiliation: "Test", joiningAsMember: true, mainExecutivePOC: true,
  laboratoryExecutivePOC: true, invoicingExecutivePOC: true, createdAt: 2021, updatedAt: 2021,
}
const mockResidentAdvisory: ResidentCompanyAdvisory = {
  id: 1, name: "ResidentCompanyAdvisor", status: '1', title: "ResidentCompanyAdvisor",
  organization: "Tesla", companyId: 1, createdAt: 2021, updatedAt: 2021
}
const mockResidentTechnical: ResidentCompanyTechnical = {
  id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
  title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management", joiningAsMember: true,
  laboratoryExecutivePOC: true, invoicingExecutivePOC: true, emergencyExecutivePOC: true, createdAt: 2021, updatedAt: 2021,
}
const mock: UpdateResidentCompanyPayload = {
  "id": 1, "email": "yestest@gmail.com", "name": "New Vision", "companyName": "NewVisionTest",
  "site": [1], "biolabsSources": 4, "otherBiolabsSources": "", "technology": "wrsdfcersdgsfd",
  "rAndDPath": "r R&D path & commerciali", "startDate": 1625097600,
  "foundedPlace": "etsfgve", "companyStage": 4, "otherCompanyStage": "", "funding": "12", "fundingSource": [2, 7],
  "otherFundingSource": "", "intellectualProperty": 3,
  "otherIntellectualProperty": "", "isAffiliated": false, "affiliatedInstitution": "",
  "noOfFullEmp": 13, "empExpect12Months": 13, "utilizeLab": 13, "expect12MonthsUtilizeLab": 13,
  "industry": ['94,95, 96, 97'], "otherIndustries": {}, "modality": ['6, 7, 8,9, 10, 11'],
  "otherModality": {}, "preferredMoveIn": 4, "equipmentOnsite": "TestNew", "elevatorPitch": "string",
  "companySize": 20, "logoOnWall": true, "logoOnLicensedSpace": true, "bioLabsAssistanceNeeded": "string",
  "technologyPapersPublished": true, "technologyPapersPublishedLinkCount": 0, "technologyPapersPublishedLink": "string",
  "patentsFiledGranted": true, "patentsFiledGrantedDetails": "newvision", "foundersBusinessIndustryBefore": true,
  "academiaPartnerships": true, "academiaPartnershipDetails": "ersdf", "industryPartnerships": true,
  "industryPartnershipsDetails": "string", "newsletters": true, "shareYourProfile": true,
  "website": "string", "companyMembers": [], "companyAdvisors": [],
  "companyTechnicalTeams": [], "foundersBusinessIndustryName": "TestNV", "primarySite": [1], "sitesApplied": [2]
};
const mockNotes: Notes = { id: 1, createdBy: 1, createdAt: new Date(), residentCompany: new ResidentCompany(), notesStatus: 1, notes: "this is note 1" };
const req: any = {
  user: { site_id: [1, 2], role: 1, companyId: 70 },
  headers: { 'x-site-id': [2] }
}

let itemsWithUpdatedInvoices = [
  {
    "productTypeId": 5,
    "sum": "0",
    "productTypeName": "Private Lab"
  },
  {
    "productTypeId": 4,
    "sum": "0",
    "productTypeName": "Private Office"
  },
  {
    "productTypeId": 3,
    "sum": "0",
    "productTypeName": "Workstation"
  },
  {
    "productTypeId": 2,
    "sum": "20",
    "productTypeName": "Lab Bench"
  },
  {
    "productTypeId": 1,
    "sum": "10",
    "productTypeName": "Membership Fee"
  }
];

const mockSpaceChangeWaitlistItems = [
  {
    "productTypeId": 5,
    "sum": "0",
    "productTypeName": "Private Lab"
  },
  {
    "productTypeId": 4,
    "sum": "2",
    "productTypeName": "Private Office"
  },
  {
    "productTypeId": 3,
    "sum": "4",
    "productTypeName": "Workstation"
  },
  {
    "productTypeId": 2,
    "sum": "1",
    "productTypeName": "Lab Bench"
  },
  {
    "productTypeId": 1,
    "sum": "0",
    "productTypeName": "Membership Fee"
  }
];
const mockCatCount: any =[
  {
      "name": "Therapeutics (Biopharma)",
      "id": 1,
      "child": [
          {
              "name": "Cardiovascular & Metabolism",
              "id": 2,
              "child": [
                  {
                      "name": "Diabetes and related disorders",
                      "id": 3
                  },
                  {
                      "name": "Chronic Kidney Disease (CKD)",
                      "id": 4
                  },
                  {
                      "name": "Cardiovascular Disease (CVD)",
                      "id": 5
                  },
                  {
                      "name": "NAFLD, NASH, or cirrhosis",
                      "id": 6
                  },
                  {
                      "name": "Obesity",
                      "id": 7
                  },
                  {
                      "name": "Cachexia",
                      "id": 8
                  },
                  {
                      "name": "Atherosclerosis and vascular diseases",
                      "id": 9
                  },
                  {
                      "name": "Dyslipidemia",
                      "id": 10
                  },
                  {
                      "name": "Cardiac arrhythmias and associated disorders",
                      "id": 11
                  },
                  {
                      "name": "Pulmonary hypertension",
                      "id": 12
                  },
                  {
                      "name": "Other",
                      "id": 29999
                  }
              ]
          },
          {
              "name": "Oncology",
              "id": 13,
              "child": [
                  {
                      "name": "Hematological malignancies",
                      "id": 14
                  },
                  {
                      "name": "Chronic lymphocytic leukemia (CLL)",
                      "id": 15
                  },
                  {
                      "name": "Mantle cell lymphoma (MCL)",
                      "id": 16
                  },
                  {
                      "name": "Prostate cancer",
                      "id": 17
                  },
                  {
                      "name": "Lung Cancer",
                      "id": 18
                  },
                  {
                      "name": "Pancreatic cancer",
                      "id": 19
                  },
                  {
                      "name": "GI stromal tumors",
                      "id": 20
                  },
                  {
                      "name": "Breast cancer",
                      "id": 21
                  },
                  {
                      "name": "Renal cell carcinoma",
                      "id": 22
                  },
                  {
                      "name": "Kidney cancer",
                      "id": 23
                  },
                  {
                      "name": "Ovarian cancer",
                      "id": 24
                  },
                  {
                      "name": "Bladder cancer",
                      "id": 25
                  },
                  {
                      "name": "Liver cancer",
                      "id": 26
                  },
                  {
                      "name": "Melanoma",
                      "id": 27
                  },
                  {
                      "name": "Bone metastasis",
                      "id": 28
                  },
                  {
                      "name": "SEGA tumors",
                      "id": 29
                  },
                  {
                      "name": "Neuroendocrine tumors",
                      "id": 30
                  },
                  {
                      "name": "Glioblastoma",
                      "id": 31
                  },
                  {
                      "name": "Other",
                      "id": 139999
                  }
              ]
          },
          {
              "name": "Neuroscience",
              "id": 32,
              "child": [
                  {
                      "name": "Schizophrenia",
                      "id": 33
                  },
                  {
                      "name": "Major Depressive Disorder (MDD)",
                      "id": 34
                  },
                  {
                      "name": "Alzheimer’s Disease",
                      "id": 35
                  },
                  {
                      "name": "Spinal muscular atrophy",
                      "id": 36
                  },
                  {
                      "name": "Huntington’s disease",
                      "id": 37
                  },
                  {
                      "name": "Autism or Autism Spectrum Disorder",
                      "id": 38
                  },
                  {
                      "name": "Parkinson’s disease",
                      "id": 39
                  },
                  {
                      "name": "Down syndrome",
                      "id": 40
                  },
                  {
                      "name": "Multiple sclerosis",
                      "id": 41
                  },
                  {
                      "name": "Other",
                      "id": 329999
                  }
              ]
          },
          {
              "name": "Infectious Diseases",
              "id": 42,
              "child": [
                  {
                      "name": "HIV",
                      "id": 43
                  },
                  {
                      "name": "Tuberculosis (TB)",
                      "id": 44
                  },
                  {
                      "name": "Respiratory Syncytial Virus (RSV)",
                      "id": 45
                  },
                  {
                      "name": "Hepatitis B",
                      "id": 46
                  },
                  {
                      "name": "Global health crisis pathogens Ebola, Zika, Dengue, SARS-COV2",
                      "id": 47
                  },
                  {
                      "name": "Malaria",
                      "id": 48
                  },
                  {
                      "name": "Multi-drug Resistant Bacteria",
                      "id": 49
                  },
                  {
                      "name": "Influenza",
                      "id": 50
                  },
                  {
                      "name": "Cryptosporidiosis",
                      "id": 51
                  },
                  {
                      "name": "Kinetoplastid diseases",
                      "id": 52
                  },
                  {
                      "name": "Other",
                      "id": 429999
                  }
              ]
          },
          {
              "name": "Immunology and Inflammation",
              "id": 53,
              "child": [
                  {
                      "name": "Rheumatoid arthritis",
                      "id": 54
                  },
                  {
                      "name": "Psoriatic arthritis",
                      "id": 55
                  },
                  {
                      "name": "Lupus",
                      "id": 56
                  },
                  {
                      "name": "Ulcerative colitis",
                      "id": 57
                  },
                  {
                      "name": "Crohn’s disease",
                      "id": 58
                  },
                  {
                      "name": "NAFLD, NASH, or cirrhosis",
                      "id": 59
                  },
                  {
                      "name": "Atopic dermatitis",
                      "id": 60
                  },
                  {
                      "name": "Psoriasis",
                      "id": 61
                  },
                  {
                      "name": "Vitiligo",
                      "id": 62
                  },
                  {
                      "name": "Alopecia areata",
                      "id": 63
                  },
                  {
                      "name": "Other",
                      "id": 539999
                  }
              ]
          },
          {
              "name": "Vaccines",
              "id": 64,
              "child": [
                  {
                      "name": "Pneumococcal disease",
                      "id": 65
                  },
                  {
                      "name": "Meningococcal disease",
                      "id": 66
                  },
                  {
                      "name": "Influenza",
                      "id": 67
                  },
                  {
                      "name": "Coronavirus",
                      "id": 68
                  },
                  {
                      "name": "Dengue",
                      "id": 69
                  },
                  {
                      "name": "Cancer",
                      "id": 70
                  },
                  {
                      "name": "Group B streptococcus",
                      "id": 71
                  },
                  {
                      "name": "Other",
                      "id": 649999
                  }
              ]
          },
          {
              "name": "Ophthalmology",
              "id": 72,
              "child": [
                  {
                      "name": "Retinal vein occlusion (RVO)",
                      "id": 73
                  },
                  {
                      "name": "Age-related macular degeneration (AMD)",
                      "id": 74
                  },
                  {
                      "name": "Diabetic eye disease",
                      "id": 75
                  },
                  {
                      "name": "Cataracts",
                      "id": 76
                  },
                  {
                      "name": "Conjunctivitis",
                      "id": 77
                  },
                  {
                      "name": "Dry Eye Disease",
                      "id": 78
                  },
                  {
                      "name": "Glaucoma",
                      "id": 79
                  },
                  {
                      "name": "Macular Edema",
                      "id": 80
                  },
                  {
                      "name": "Myopia",
                      "id": 81
                  },
                  {
                      "name": "Ocular disease",
                      "id": 82
                  },
                  {
                      "name": "Retinal Diseases",
                      "id": 83
                  },
                  {
                      "name": "Other",
                      "id": 729999
                  }
              ]
          },
          {
              "name": "Rare diseases",
              "id": 98,
              "child": []
          },
          {
              "name": "Genetic diseases",
              "id": 99,
              "child": []
          },
          {
              "name": "Other",
              "id": 19999,
              "child": [],
          }
      ],
      "industrycount":0
  },
  {
      "name": "Medical Devices",
      "id": 84,
      "child": [
          {
              "name": "Surgery",
              "id": 85
          },
          {
              "name": "Vision Care",
              "id": 86
          },
          {
              "name": "Orthopedics",
              "id": 87
          },
          {
              "name": "Cardiovascular & Specialty Solutions",
              "id": 88
          },
          {
              "name": "Other",
              "id": 849999
          }
      ],
      "industrycount":0
  },
  {
      "name": "Diagnostics/Biomarkers",
      "id": 89,
      "child": [],
      "industrycount":0
  },
  {
      "name": "Lab/Research Tools",
      "id": 90,
      "child": [],
      "industrycount":0
  },
  {
      "name": "Consumer Product",
      "id": 91,
      "child": [
          {
              "name": "Skin Health",
              "id": 92
          },
          {
              "name": "Self Care",
              "id": 93
          },
          {
              "name": "Other",
              "id": 919999
          }
      ],
      "industrycount":0
  },
  {
      "name": "Digital Health",
      "id": 94,
      "child": [],
      "industrycount":0
  },
  {
      "name": "Agriculture",
      "id": 95,
      "child": [],
      "industrycount":0
  },
  {
      "name": "Veterinary Medicine",
      "id": 96,
      "child": [],
      "industrycount":0
  },
  {
      "name": "Advanced Materials",
      "id": 97,
      "child": [],
      "industrycount":0
  }
]

describe('ResidentCompanyService', () => {
  let residentCompanyService: ResidentCompanyService;
  let productTypeService;
  let residentCompanyRepository: Repository<ResidentCompany>;
  let residentCompanyHistoryRepository: Repository<ResidentCompanyHistory>;
  let residentCompanyDocumentsRepository: Repository<ResidentCompanyDocuments>;
  let residentCompanyAdvisoryRepository: Repository<ResidentCompanyAdvisory>;
  let residentCompanyManagementRepository: Repository<ResidentCompanyManagement>;
  let residentCompanyTechnicalRepository: Repository<ResidentCompanyTechnical>;
  let siteRepository: Repository<Site>;
  let biolabsSourceRepository: Repository<BiolabsSource>;
  let categoryRepository: Repository<Category>;
  let fundingRepository: Repository<Funding>;
  let modalityRepository: Repository<Modality>;
  let technologyStageRepository: Repository<TechnologyStage>;
  let userRepository: Repository<User>;
  let notesRepository: Repository<Notes>;
  let spaceChangeWaitlistRepository: Repository<SpaceChangeWaitlist>;
  let itemRepository: Repository<Item>;


  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ResidentCompanyService, Mail, ProductTypeService,
        {
          provide: getRepositoryToken(ResidentCompany), useValue: {
            createQueryBuilder: jest.fn(() =>
            ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              setParameter: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
              getRawOne: jest.fn(),
              getRawMany: jest.fn(),
              andWhere: jest.fn().mockReturnThis(),
              skip: jest.fn().mockReturnThis(),
              take: jest.fn().mockReturnThis(),
              addOrderBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getMany: jest.fn()
            })),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            query: jest.fn(),
            update: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(ResidentCompanyHistory), useValue: {
            find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            })
          }
        },
        {
          provide: getRepositoryToken(ResidentCompanyAdvisory), useValue: {
            create: jest.fn(),
            find: jest.fn(), findOne: jest.fn(),
            save: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), query: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }),
            update: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            })
          }
        },
        { provide: getRepositoryToken(ResidentCompanyDocuments), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn(), create: jest.fn() } },
        {
          provide: getRepositoryToken(ResidentCompanyManagement), useValue: {
            find: jest.fn(), findOne: jest.fn(), save: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), query: jest.fn(),
            update: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), create: jest.fn(() => mockResidentManagement)
          }
        },
        {
          provide: getRepositoryToken(ResidentCompanyTechnical), useValue: {
            find: jest.fn(), findOne: jest.fn(), save: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), query: jest.fn(),
            update: jest.fn(() => {
              return {
                catch: jest.fn(),
              }
            }), create: jest.fn()
          }
        },

        { provide: getRepositoryToken(Site), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(BiolabsSource), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(Category), useValue: { query: jest.fn(), find: jest.fn(), findOne: jest.fn(), save: jest.fn() } },
        { provide: getRepositoryToken(Funding), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(Modality), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(TechnologyStage), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        { provide: getRepositoryToken(User), useValue: { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), query: jest.fn() } },
        {
          provide: getRepositoryToken(Notes), useValue: {
            find: jest.fn(), findOne: jest.fn(), query: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(() =>
            ({
              select: jest.fn().mockReturnThis(),
              addSelect: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              getRawMany: jest.fn().mockReturnThis(),
            }))
          }
        },
        {
          provide: getRepositoryToken(SpaceChangeWaitlist), useValue: {
            createQueryBuilder: jest.fn(() => ({
              update: jest.fn().mockReturnThis(),
              set: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              execute: jest.fn(),
              addSelect: jest.fn().mockReturnThis(),
              leftJoin: jest.fn().mockReturnThis(),
              getRawMany: jest.fn(),
              addOrderBy: jest.fn().mockReturnThis(),
              orderBy: jest.fn().mockReturnThis(),
              select : jest.fn().mockReturnThis()

            })),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            query: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(Item), useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(() => mockSpaceChangeWaitlistItem),
            save: jest.fn(),
            query: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
          }
        },
        { provide: getRepositoryToken(ProductType), useValue: {} },
      ],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })
      ],

    }).compile();

    residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
    residentCompanyRepository = await module.get<Repository<ResidentCompany>>(getRepositoryToken(ResidentCompany));
    residentCompanyService = await module.get<ResidentCompanyService>(ResidentCompanyService);
    residentCompanyHistoryRepository = await module.get<Repository<ResidentCompanyHistory>>(getRepositoryToken(ResidentCompanyHistory));
    residentCompanyDocumentsRepository = await module.get<Repository<ResidentCompanyDocuments>>(getRepositoryToken(ResidentCompanyDocuments));
    residentCompanyAdvisoryRepository = await module.get<Repository<ResidentCompanyAdvisory>>(getRepositoryToken(ResidentCompanyAdvisory));
    residentCompanyManagementRepository = await module.get<Repository<ResidentCompanyManagement>>(getRepositoryToken(ResidentCompanyManagement));
    residentCompanyTechnicalRepository = await module.get<Repository<ResidentCompanyTechnical>>(getRepositoryToken(ResidentCompanyTechnical));
    siteRepository = await module.get<Repository<Site>>(getRepositoryToken(Site));
    biolabsSourceRepository = await module.get<Repository<BiolabsSource>>(getRepositoryToken(BiolabsSource));
    categoryRepository = await module.get<Repository<Category>>(getRepositoryToken(Category));
    fundingRepository = await module.get<Repository<Funding>>(getRepositoryToken(Funding));
    modalityRepository = await module.get<Repository<Modality>>(getRepositoryToken(Modality));
    technologyStageRepository = await module.get<Repository<TechnologyStage>>(getRepositoryToken(TechnologyStage));
    userRepository = await module.get<Repository<User>>(getRepositoryToken(User));
    notesRepository = await module.get<Repository<Notes>>(getRepositoryToken(Notes));
    spaceChangeWaitlistRepository = await module.get<Repository<SpaceChangeWaitlist>>(getRepositoryToken(SpaceChangeWaitlist));
    itemRepository = await module.get<Repository<Item>>(getRepositoryToken(Item));
    productTypeService = await module.get<ProductTypeService>(ProductTypeService);
  });

  it('it should be defined', () => {
    expect(residentCompanyService).toBeDefined();
  });
  describe('get method', () => {
    it('it should  return  resident company', () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      residentCompanyService.get(mockRC.id);
    });
  });
  describe('getByEmail method', () => {
    it('it should called createQueryBuilder  method ', async () => {
      residentCompanyRepository
        .createQueryBuilder('resident-companies')
        .where('resident-companies.email = :email')
        .setParameter('email', mockRC.email)
        .getOne();
      //jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockResolvedValue(mockRC);
      const result = await residentCompanyService.getByEmail(mockRC.email);
      expect(result).not.toBeNull();
    });
    it('it should throw exception if user id is not provided  ', async () => {
      jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockReturnValue(null);
      try {
        await residentCompanyService.getByEmail(new BiolabsException());
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
      }
    });
  });
  describe('Create method', () => {

    it('it should called getByEmail  method ', async () => {
      residentCompanyRepository
        .createQueryBuilder('resident-companies')
        .where('resident-companies.email = :email')
        .setParameter('email', mockAddResidentCompany.email)
        .getOne();

      let ans = await residentCompanyService.create(mockAddResidentCompany);
      expect(ans).not.toBeNull();
    })
    it('it should throw exception if user id is not provided  ', async () => {
      jest.spyOn(residentCompanyService, 'getByEmail').mockResolvedValueOnce(mockRC);
      try {
        await residentCompanyService.create(mockAddResidentCompany);
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe('User with provided email already created.');
        expect(e.response.statusCode).toBe(406);
      }
    });

  });
  describe('updateResidentCompanyImg method', () => {
    let payload = {
      id: 1,
      imageUrl: "logoimgurl.img",
      fileType: "logo"
    }
    const companyId = payload.id;
    it('should return resident company object when fileType is logo', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (mockRC) {
        if (payload.fileType == 'logo') {
          mockRC.logoImgUrl = payload.imageUrl;
          await residentCompanyRepository.update(companyId, mockRC);
        }
      }
      let result = await residentCompanyService.updateResidentCompanyImg(payload);
      expect(result).not.toBeNull();
      expect(result.logoImgUrl).toEqual(mockRC.logoImgUrl);
      expect(result).toBe(mockRC);
    });
    it('should return resident company object when fileType is pitchdeck', async () => {
      payload.fileType = "pitchdeck";
      payload.imageUrl = "pitchDeck.img";
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (mockRC) {
        if (payload.fileType == 'pitchdeck') {
          mockRC.pitchdeck = payload.imageUrl;
          await residentCompanyRepository.update(companyId, mockRC);
        }
      }
      let result = await residentCompanyService.updateResidentCompanyImg(payload);
      expect(result).not.toBeNull();
      expect(result.logoImgUrl).toEqual(mockRC.logoImgUrl);
      expect(result).toBe(mockRC);

    });
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(null);
      try {
        await residentCompanyService.updateResidentCompanyImg(new NotAcceptableException("resident company with provided id not available."));
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe("resident company with provided id not available.")
      }
    });
  });
  describe('getResidentCompanies method', () => {
    let siteIdArr: Array<any> = [1, 2]
    let mockRecidentCompanies: Array<any> = [{
      name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
      technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
      otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
      otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
      utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
      preferredMoveIn: 1, otherIndustries: {}, otherModality: {}
    }]
    it('it should return array of Resident companies', async () => {
      residentCompanyRepository
        .createQueryBuilder("product")
        .select("resident_companies.* ")
        .addSelect("s.name", "siteName")
        .addSelect("s.id", "siteId")
        .leftJoin('sites', 's', 's.id = Any(resident_companies.site)')
        .where("resident_companies.status IN (:...status)", { status: [1, 0] })
        .getRawMany();
      let result = await residentCompanyService.getResidentCompanies(listRCPayload, siteIdArr);
      //jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockResolvedValueOnce(mock)
      expect(result).not.toBeNull();
    })
    it('should throw exception ', async () => {
      jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockImplementation(() => {
        throw new BiolabsException('')
      });
      try {
        await residentCompanyService.getResidentCompanies(listRCPayload, siteIdArr);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
      }
    });
  });
  describe('addResidentCompany method', () => {
    const req: any = {
      user: { site_id: [1, 2], role: 1 },
      headers: { 'x-site-id': [2] }
    }
    let resp = { status: 'success', message: 'Application Successfully submitted' };
    // it('should return resident companies  object', async () => {
    //  // jest.spyOn(residentCompanyService, 'getByEmail').mockResolvedValueOnce(mockRC); 

    //   if (mockRC.id) {
    //     // const historyData: any = JSON.parse(JSON.stringify(mockRC));
    //     // historyData.comnpanyId = mockRC.id;
    //     // delete historyData.id;
    //     // await this.residentCompanyHistoryRepository.save(historyData);
    //     jest.spyOn(residentCompanyRepository, 'save').mockResolvedValueOnce(mockRC);
    //     //jest.spyOn(residentCompanyHistoryRepository, 'save').mockResolvedValueOnce(mockResidentHistory);
    //   }
    //  // await residentCompanyService.sendEmailToSiteAdmin(sites, req, payload.companyName, "MAIL_FOR_RESIDENT_COMPANY_FORM_SUBMISSION");
    //   let result = await residentCompanyService.addResidentCompany(mockAddResidentCompany, req);
    //   console.log(result);
    //   // expect(result).not.toBeNull();
    //   // expect(result).toStrictEqual(resp);
    // })
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyDocumentsRepository, 'save').mockRejectedValueOnce(new InternalException('Error in adding resident company document'));
      try {
        await residentCompanyService.addResidentCompany(mockAddResidentCompany, req);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    });
  });
  describe('addResidentCompanyDocument method', () => {

    let payload: ResidentCompanyDocumentsFillableFields = {
      id: 1,
      email: "elon@space.com",
      company_id: 1,
      doc_type: "Document",
      name: "ResidentDocument",
      link: "residentDocumentLink",
      status: '1'
    }
    it('should return resident companies document object', async () => {
      jest.spyOn(residentCompanyDocumentsRepository, 'save').mockResolvedValueOnce(mockResidentDocument);
      let result = await residentCompanyService.addResidentCompanyDocument(payload)
      expect(result).toBe(mockResidentDocument);
    })
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyDocumentsRepository, 'save').mockRejectedValueOnce(new InternalException('Error in adding resident company document'));
      try {
        await residentCompanyService.addResidentCompanyDocument(payload);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    });
  });
  // <!--TO-DO-->
  describe('residentCompanyManagements method', () => {
    let companyMembers: Array<ResidentCompanyManagementFillableFields> = [
      {
        id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
        title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
        academicAffiliation: "Test", joiningAsMember: true, mainExecutivePOC: true,
        laboratoryExecutivePOC: true, invoicingExecutivePOC: true,
      }
    ];
    it('should call addResidentCompanyManagement method ', async () => {
      if (companyMembers.length > 0) {
        for (let i = 0; i < companyMembers.length; i++) {
          let companyMember = companyMembers[i];
          if (residentCompanyService.checkEmptyVal('managements', companyMember))
            jest.spyOn(residentCompanyService, 'addResidentCompanyManagement').mockImplementation();
        }
      }
      let result = await residentCompanyService.residentCompanyManagements(companyMembers, 1);

      expect(result).not.toBeNull();
    });
  });

  describe('addResidentCompanyAdvisor method', () => {
    let payload: ResidentCompanyAdvisoryFillableFields = {
      id: 1,
      name: "ResidentCompanyAdvisor",
      status: '1',
      title: "ResidentCompanyAdvisor",
      organization: "Tesla",
      companyId: 1
    }
    it('should return resident companies document object if payload id is available', async () => {
      if (payload.id)
        await residentCompanyAdvisoryRepository.update(payload.id, payload);
      let result = await residentCompanyService.addResidentCompanyAdvisor(payload);
      expect(result).not.toBeNull();
    })
    it('should throw internalException', async () => {
      if (payload.id)
        jest.spyOn(residentCompanyAdvisoryRepository, 'update').mockRejectedValueOnce(new InternalException(''));
      try {
        await residentCompanyService.addResidentCompanyAdvisor(payload);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    })
    it('should  save and return resident companies document object if payload id is not available', async () => {
      payload.id = null;
      delete payload.id;
      await residentCompanyAdvisoryRepository.save(residentCompanyAdvisoryRepository.create(payload))
      let result = await residentCompanyService.addResidentCompanyAdvisor(payload);
      expect(result).not.toBeNull();
    })
    it('should throw internalException', async () => {
      jest.spyOn(residentCompanyAdvisoryRepository, 'save').mockRejectedValueOnce(new InternalException(''));
      try {
        await residentCompanyService.addResidentCompanyAdvisor(payload);
      } catch (error) {
        expect(error.name).toBe('InternalException');
        expect(error instanceof InternalException).toBeTruthy();
      }
    })
  });
  // <!--TO-DO-->
  describe('residentCompanyAdvisors method', () => {
    let advisors: Array<ResidentCompanyAdvisoryFillableFields> = [
      {
        id: 1,
        name: "ResidentCompanyAdvisor",
        status: '1',
        title: "ResidentCompanyAdvisor",
        organization: "Tesla",
        companyId: 1
      }
    ];
    it('should call residentCompanyAdvisors method ', async () => {
      if (advisors.length > 0) {
        for (let i = 0; i < advisors.length; i++) {
          let advisor = advisors[i];
          if (residentCompanyService.checkEmptyVal('advisors', advisor))
            await residentCompanyService.addResidentCompanyAdvisor(advisor);
        }
      }
      let result = await residentCompanyService.residentCompanyAdvisors(advisors, 1);
      expect(result).not.toBeNull();
    });
  });
  describe('addResidentCompanyManagement method', () => {
    let payload: ResidentCompanyManagementFillableFields = {
      id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
      title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
      academicAffiliation: "Test", joiningAsMember: true, mainExecutivePOC: true,
      laboratoryExecutivePOC: true, invoicingExecutivePOC: true
    }
    it('should return   resident companies management object', async () => {
      if (payload.id) {
        await residentCompanyManagementRepository.update(payload.id, payload);
      }
      let result = await residentCompanyService.addResidentCompanyManagement(payload);
      expect(result).not.toBeNull();
    })
    it('should throw internalException', async () => {
      if (payload.id)
        jest.spyOn(residentCompanyManagementRepository, 'update').mockRejectedValueOnce(new InternalException(''));
      try {
        await residentCompanyService.addResidentCompanyManagement(payload);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    })
    it('should return   resident companies management object', async () => {
      payload.id = null;
      delete payload.id;
      await residentCompanyManagementRepository.save(payload);
      jest.spyOn(residentCompanyManagementRepository, 'save').mockResolvedValueOnce(mockResidentManagement);
      let result = await residentCompanyService.addResidentCompanyManagement(payload);
      expect(result).not.toBeNull();
    })
    it('should throw internalException', async () => {
      jest.spyOn(residentCompanyManagementRepository, 'save').mockRejectedValueOnce(new InternalException(''));
      try {
        await residentCompanyService.addResidentCompanyManagement(payload);
      } catch (error) {
        expect(error.name).toBe('InternalException');
        expect(error instanceof InternalException).toBeTruthy();
      }
    })
  });
  // <!--TO-DO-->
  describe('residentCompanyTechnicals method', () => {
    let technicals: Array<ResidentCompanyTechnicalFillableFields> = [
      {
        id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
        title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
        joiningAsMember: true, mainExecutivePOC: true, laboratoryExecutivePOC: true, invoicingExecutivePOC: true
      }
    ];
    it('should call residentCompanyTechnicals method ', async () => {
      if (technicals.length > 0) {
        for (let i = 0; i < technicals.length; i++) {
          let technical = technicals[i];
          if (residentCompanyService.checkEmptyVal('technicals', technicals))
            await residentCompanyService.addResidentCompanyTechnical(technical);
        }
      }
      let result = await residentCompanyService.residentCompanyTechnicals(technicals, 1);
      expect(result).not.toBeNull();
    });
  });
  describe('addResidentCompanyTechnical method', () => {
    let payload: ResidentCompanyTechnicalFillableFields = {
      id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
      title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
      joiningAsMember: true, mainExecutivePOC: true, laboratoryExecutivePOC: true, invoicingExecutivePOC: true
    }
    it('should return resident companies technical object if payload id is available', async () => {
      if (payload.id)
        await residentCompanyTechnicalRepository.update(payload.id, payload);
      let result = await residentCompanyService.addResidentCompanyTechnical(payload);
      expect(result).not.toBeNull();
    })
    it('should throw internalException', async () => {
      if (payload.id)
        jest.spyOn(residentCompanyTechnicalRepository, 'update').mockRejectedValueOnce(new InternalException(''));
      try {
        await residentCompanyService.addResidentCompanyTechnical(payload);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    })
    it('should  save and return resident companies technical object if payload id is not available', async () => {
      payload.id = null;
      delete payload.id;
      await residentCompanyTechnicalRepository.save(residentCompanyTechnicalRepository.create(payload))
      let result = await residentCompanyService.addResidentCompanyTechnical(payload);
      expect(result).not.toBeNull();
    })
    it('should throw internalException', async () => {
      jest.spyOn(residentCompanyTechnicalRepository, 'save').mockRejectedValueOnce(new InternalException(''));
      try {
        await residentCompanyService.addResidentCompanyTechnical(payload);
      } catch (error) {
        expect(error.name).toBe('InternalException');
        expect(error instanceof InternalException).toBeTruthy();
      }
    })
  });

  describe('getResidentCompaniesBkp method', () => {
    let mockRecidentCompanies: Array<any> = [{
      name: "Biolabs", email: "elon@space.com", companyName: "tesla", site: [2, 1], biolabsSources: 1, otherBiolabsSources: "",
      technology: "Tech World", rAndDPath: "Tech World", startDate: 1626134400, foundedPlace: "Tech World", companyStage: 1,
      otherCompanyStage: "", funding: "1", fundingSource: [1], otherFundingSource: "", intellectualProperty: 1,
      otherIntellectualProperty: "", isAffiliated: false, affiliatedInstitution: "", noOfFullEmp: 0, empExpect12Months: 0,
      utilizeLab: 0, expect12MonthsUtilizeLab: 0, industry: ["95"], modality: ["3"], equipmentOnsite: "Tech World",
      preferredMoveIn: 1, otherIndustries: {}, otherModality: {}
    }]
    it('should return array of Resident companies', async () => {
      jest.spyOn(residentCompanyRepository, 'find').mockResolvedValueOnce(mockRecidentCompanies);
      let result = await residentCompanyService.getResidentCompaniesBkp(listRCPayload)
      expect(result).toBe(mockRecidentCompanies);
    })
    it('should throw exception if company with provided id not available.', async () => {
      try {
        await residentCompanyService.getResidentCompaniesBkp(null);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Error in find resident company for Bkp');
      }
    });
  });

  describe('getResidentCompanyForSponsor method', () => {
    const companyStats = {
      startUpcount: 0,
      avgTeamSize: 0
    }
    const mockCount = 2;
    const mockMedian = 4;
    const mockcatStatus = [
      {
        "name": "Diagnostics/Biomarkers",
        "industrycount": 55
      },
      {
        "name": "Digital Health",
        "industrycount": 38
      },
      {
        "name": "Veterinary Medicine",
        "industrycount": 36
      }
    ]

    it('should return array of Resident companies for Sponser', async () => {
      //jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockReturnThis();
      residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("count(*)", "graduate").
        where("resident_companies.companyStatus = :status", { status: '4' }).getRawOne();
      jest.spyOn(residentCompanyRepository, 'query').mockResolvedValue(mockCount);
      jest.spyOn(residentCompanyRepository, 'query').mockResolvedValue(mockMedian);
      jest.spyOn(residentCompanyService, 'getCategoriesandSubCategories').mockResolvedValue(mockCatCount)
      jest.spyOn(residentCompanyService, 'getCategoryCount').mockResolvedValue(mockcatStatus);
      let result = await residentCompanyService.getResidentCompanyForSponsor();
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result).toEqual({
        companyStats: {},
        graduate: 0,
        categoryStats: [
          {
            "name": "Diagnostics/Biomarkers",
            "industrycount": 55
          },
          {
            "name": "Digital Health",
            "industrycount": 38
          },
          {
            "name": "Veterinary Medicine",
            "industrycount": 36
          }
        ]
      })
    })
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockImplementation(() => {
        throw new BiolabsException('Error in find resident company for sponser')
      });
      try {
        await residentCompanyService.getResidentCompanyForSponsor();
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Error in find resident company for sponser');
      }
    });
  });

  describe('getRcSites method', () => {
    let mockSites: Array<any> = [{ "id": 2, "name": "Ipsen" }, { "id": 1, "name": "Tufts" }];
    it('should return array of Resident companies Sites', async () => {
      jest.spyOn(siteRepository, 'find').mockResolvedValueOnce(mockSites);
      let result = await residentCompanyService.getRcSites(mockAddResidentCompany.site)
      expect(result).toBe(mockSites);
    })
  });

  describe('getRcCategories method', () => {
    let mockCategories: Array<any> = [{ "id": 1, "parent_id": 0, "name": "Therapeutics (Biopharma)", "status": "1", "createdAt": "2021-07-08 13:24:22.972671" },
    { "id": 2, "parent_id": 1, "name": "Cardiovascular & Metabolism", "status": "1", "createdAt": "2021-07-08 13:24:23.083412" }];
    it('should return array of categories', async () => {
      jest.spyOn(categoryRepository, 'find').mockResolvedValueOnce(mockCategories);
      let result = await residentCompanyService.getRcCategories([1, 2])
      expect(result).toBe(mockCategories);
    })
  });

  describe('getRcFundings method', () => {
    let mockFundings: Array<any> = [{ "id": 1, "name": "Grant funded", "status": "1", "createdAt": "2021-07-08 13:24:22.972671" },
    { "id": 2, "name": "Self-funded", "status": "1", "createdAt": "2021-07-08 13:24:23.083412" }];
    it('should return array of fundings', async () => {
      jest.spyOn(fundingRepository, 'find').mockResolvedValueOnce(mockFundings);
      let result = await residentCompanyService.getRcFundings([1, 2])
      expect(result).toBe(mockFundings);
    })
  });

  describe('getRcTechnologyStages method', () => {
    let mockTechnologyStages: TechnologyStage = { "id": 1, "name": "Discovery/R&D", "status": "1", "createdAt": 1626134400, "updatedAt": 1626134400 };
    it('should return array of Technology stages', async () => {
      jest.spyOn(technologyStageRepository, 'findOne').mockResolvedValueOnce(mockTechnologyStages);
      let result = await residentCompanyService.getRcTechnologyStages([1, 2])
      expect(result).toBe(mockTechnologyStages);
    })
  });


  describe('getRcBiolabsSources method', () => {
    let mockRcBiolabsSources: BiolabsSource = { "id": 1, "name": "Website", "status": "1", "createdAt": 1626134400, "updatedAt": 1626134400 };
    it('should return array of resident company biolabs sources', async () => {
      jest.spyOn(biolabsSourceRepository, 'findOne').mockResolvedValue(mockRcBiolabsSources);
      let result = await residentCompanyService.getRcBiolabsSources([1, 2])
      expect(result).toBe(mockRcBiolabsSources);
    })
  });


  describe('getRcModalities method', () => {
    let mockRcModalities: Array<any> = [{ "id": 1, "name": "Antibody", "status": "1", "createdAt": "2021-07-08 13:24:22.972671" },
    { "id": 2, "name": "Antisense oligonucleotide/siRNA", "status": "1", "createdAt": "2021-07-08 13:24:23.083412" }];
    it('should return array of resident company modalities', async () => {
      jest.spyOn(modalityRepository, 'find').mockResolvedValueOnce(mockRcModalities);
      let result = await residentCompanyService.getRcModalities([1, 2])
      expect(result).toBe(mockRcModalities);
    })
  });

  describe('getRcMembers method', () => {
    let mockRcMembers: Array<any> = [{ "id": 1, "companyId": 1, "name": "Antibody", "title": "Test", "email": "test@biolabs.in", "phone": "999999999", "linkedinLink": "testlink.in", "status": "0" }];
    it('should return array of resident company Members', async () => {
      jest.spyOn(residentCompanyManagementRepository, 'find').mockResolvedValueOnce(mockRcMembers);
      let result = await residentCompanyService.getRcMembers(1)
      expect(result).not.toBeNull();
    })
  });

  describe('getRcAdvisors method', () => {
    let mockRcAdvisors: Array<any> = [{ "id": 1, "companyId": 1, "name": "TestName", "title": "Test1", "organization": "biolabs", "status": "1", "createdAt": "2021-07-08 13:24:22.972671" }];
    it('should return array of resident company Advisors', async () => {
      if (1) {
        jest.spyOn(residentCompanyAdvisoryRepository, 'find').mockResolvedValueOnce(mockRcAdvisors);
      }
      let result = await residentCompanyService.getRcAdvisors(1)
      expect(result).not.toBeNull();
    })
  });

  describe('getRcTechnicalTeams method', () => {
    let mockRcTechnicalTeams: Array<any> = [{ "id": 1, "companyId": 1, "name": "TestName", "title": "Test1", "email": "test1@biolabs.in", "phone": "9999955555", "linkedinLink": "testlink1.in", "status": "0" }];
    it('should return array of resident company Technical teams', async () => {
      jest.spyOn(residentCompanyTechnicalRepository, 'find').mockResolvedValueOnce(mockRcTechnicalTeams);
      let result = await residentCompanyService.getRcTechnicalTeams(1)
      expect(result).not.toBeNull();
    })
  });

  describe('getResidentCompanyForSponsorBySite method', () => {
    let mockSites: Array<any> = [{ "id": 2, "name": "Ipsen" }, { "id": 1, "name": "Tufts" }];
    const mockStartUps =
      [
        {
          "newstartups": "0"
        }
      ]

    const mockCount = 2;
    const mockMedian = 4;
    const mockcatStatus = [
      {
        "name": "Diagnostics/Biomarkers",
        "industrycount": 55
      },
      {
        "name": "Digital Health",
        "industrycount": 38
      },
      {
        "name": "Veterinary Medicine",
        "industrycount": 36
      }
    ]
    it('should return array of Resident companies for Sponser', async () => {
      jest.spyOn(siteRepository, 'find').mockResolvedValueOnce(mockSites);
      residentCompanyRepository.
        createQueryBuilder("resident_companies").
        select("count(*)", "graduate").
        where("resident_companies.companyStatus = :status", { status: '4' }).
        andWhere(":site = ANY(resident_companies.site::int[]) ", { site: 1 }).getRawOne();
      jest.spyOn(residentCompanyRepository, 'query').mockResolvedValue(mockCount);
      jest.spyOn(residentCompanyRepository, 'query').mockResolvedValue(mockMedian);
      jest.spyOn(residentCompanyService, 'getCategoryCount').mockResolvedValue(mockcatStatus);

      let result = await residentCompanyService.getResidentCompanyForSponsorBySite();
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
    })
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(null);
      try {
        await residentCompanyService.getResidentCompanyForSponsorBySite();
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Error in find resident company for sponser');
      }
    });
  });

  describe('getResidentCompany method', () => {
    it('should return an object of resident company', async () => {
      jest.spyOn(residentCompanyService, 'checkIfValidSiteIds').mockReturnThis();
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      let result = await residentCompanyService.getResidentCompany(70, req);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result).toBe(mockRC);
    })

    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(null);
      try {
        await residentCompanyService.getResidentCompany(70, req);
      } catch (e) {
        expect(e.response.statusCode).toBe(406);
        expect(e.response.message).toBe('Company with provided id not available.');
        expect(e.response.error).toBe('Not Acceptable');
      }
    });

    it('should throw NotAcceptableException company Ids are not equal.', async () => {
      try {
        await residentCompanyService.getResidentCompany(mockRC.id, req);
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe("Company with provided id not available.")
      }
    });
  });

  /**
   * Test cases for public checkIfValidSiteIds(siteIdArrReq: number[], siteIdArrComp: number[]) method
   */
  describe('checkIfValidSiteIds method', () => {
    it('Should throw NotAcceptableException exception', async () => {
      try {
        const siteIdArr = [1, 2];
        const siteIdArrCompany = [3, 4];
        residentCompanyService.checkIfValidSiteIds(siteIdArr, siteIdArrCompany);
      } catch (e) {
        expect(e.response.statusCode).toBe(406);
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe("You do not have permission to view this company")
      }
    })
  });

  describe('updateResidentCompanyStatus method', () => {
    let payload: UpdateResidentCompanyStatusPayload = {
      "companyId": 3,
      "companyStatus": "1",
      "companyVisibility": true,
      "companyOnboardingStatus": true,
      "committeeStatus": "2",
      "selectionDate": new Date("2021-07-14"),
      "companyStatusChangeDate": new Date("2021-07-14"),
      "companyOnboardingDate": new Date()
    };
    it('should return array of resident companies', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      let result = await residentCompanyService.updateResidentCompanyStatus(payload)
      expect(result).not.toBeNull();
    })
    it('should return array of resident companies', async () => {
      mockRC.companyStatus = '2';
      if (Number(mockRC.companyStatus) == 2) {
        mockRC.companyOnboardingStatus = false;
        mockRC.companyVisibility = false;
        jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      }
      let result = await residentCompanyService.updateResidentCompanyStatus(payload)
      expect(result).not.toBeNull();
    })
    it('should throw exception if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'update').mockRejectedValueOnce(new InternalException('Error in update resident company status'));
      try {
        await residentCompanyService.updateResidentCompanyStatus(payload);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    });
    it('should throw InternalException if company with provided id not available.', async () => {
      jest.spyOn(residentCompanyRepository, 'update').mockRejectedValueOnce(new NotAcceptableException(
        'Company with provided id not available.'))
      try {
        await residentCompanyService.updateResidentCompanyStatus(payload);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    });
  });
  describe('updateResidentCompany method', () => {
    it('should return object of resident companies', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      if (mockRC) {
        jest.spyOn(residentCompanyHistoryRepository, 'save').mockResolvedValueOnce(mockResidentHistory);
        jest.spyOn(residentCompanyService, 'getResidentCompany').mockResolvedValueOnce(mockRC);
        jest.spyOn(residentCompanyService, 'sendEmailToSiteAdmin').mockReturnThis();
      }
      let result = await residentCompanyService.updateResidentCompany(mock, req);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result).toBe(mockRC);
    })
    it('should throw exception ', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'save').mockImplementation(() => {
        throw new InternalException('')
      });
      try {
        await residentCompanyService.updateResidentCompany(mock, req);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    });
  });
  describe('gloabalSearchCompaniesOld method', () => {
    let mockSearchPayload: SearchResidentCompanyPayload = {
      q: "test", role: 1, pagination: true, page: 1, limit: 10,
      companyStatus: "1", companyVisibility: true, companyOnboardingStatus: true, siteIdArr: [1, 2], industries: [1, 2], modalities: [1, 2],
      fundingSource: [1, 2], minFund: 1, maxFund: 1000, minCompanySize: 1, maxCompanySize: 100, sort: true, sortFiled: "", sortOrder: "ASC",
      memberShip: 0
    }

    it('should return array of old global resident companies', async () => {
      residentCompanyRepository.createQueryBuilder("resident_companies")
        .where("resident_companies.status IN (:...status)", { status: [1, 0] });
      // jest.spyOn(residentCompanyService, 'gloabalSearchCompaniesOld').mockResolvedValueOnce(mockRC);
      let result = await residentCompanyService.gloabalSearchCompaniesOld(mockSearchPayload, [1, 2])
      expect(result).not.toBeNull();
    })
    it('should throw exception ', async () => {
      jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockImplementation(() => {
        throw new BiolabsException('Error in search companies old')
      });
      try {
        await residentCompanyService.gloabalSearchCompaniesOld(mockSearchPayload, [1, 2])
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toEqual('Error in search companies old');
      }
    });
  });

  describe('gloabalSearchCompanies method', () => {
    let mockSearchPayload: SearchResidentCompanyPayload = {
      q: "test", role: 1, pagination: true, page: 1, limit: 10,
      companyStatus: "1", companyVisibility: true, companyOnboardingStatus: true, siteIdArr: [1, 2], industries: [1, 2], modalities: [1, 2],
      fundingSource: [1, 2], minFund: 1, maxFund: 1000, minCompanySize: 1, maxCompanySize: 100, sort: true, sortFiled: "", sortOrder: "ASC",
      memberShip: 0
    }
    let mockSiteIdArr = [1,2,3]
    let mockGraduatedCompanies =[1,3]
    const mockResidentCompanyArray = [mockRC];
    it('should return array of graduated soon resident companies', async () => {
      jest.spyOn(residentCompanyService, 'getOpenedandInprogressSpaceChangeWaitListIds').mockResolvedValue(mockGraduatedCompanies);
      jest.spyOn(residentCompanyRepository, 'query').mockResolvedValue(mockResidentCompanyArray);
      let result = await residentCompanyService.gloabalSearchCompanies(mockSearchPayload, [1, 2])
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result.length).toEqual(mockResidentCompanyArray.length);
      expect(result).toEqual(mockResidentCompanyArray);
    })
    it('should return array of resident company Object', async () => {
      jest.spyOn(residentCompanyService, 'getOpenedandInprogressSpaceChangeWaitListIds').mockResolvedValue(mockGraduatedCompanies);
      jest.spyOn(residentCompanyRepository, 'query').mockResolvedValue(mockResidentCompanyArray);
      let result = await residentCompanyService.gloabalSearchCompanies(mockSearchPayload, [1, 2])
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result.length).toEqual(mockResidentCompanyArray.length);
      expect(result).toEqual(mockResidentCompanyArray);
    })
    it('should throw exception if Getting error in find the financial fees', async () => {
      jest.spyOn(residentCompanyRepository, 'query').mockImplementation(() => {
        throw new BiolabsException('Error in search companies')
      });
      try {
        await residentCompanyService.gloabalSearchCompanies(mockSearchPayload, [1, 2]);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Error in search companies');
      }
    });
  });

  describe('getNoteById method', () => {
    let mockNotes: Notes = { id: 1, createdBy: 1, createdAt: new Date(), residentCompany: new ResidentCompany(), notesStatus: 1, notes: "Test" };
    it('should return object of note', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(mockNotes);
      let result = await residentCompanyService.getNoteById(mockNotes.id);
      expect(result).not.toBeNull();
      expect(result).toBe(mockNotes);
    })
  });

  describe('getNoteByCompanyId method', () => {
    it('should return object of Note', async () => {
      notesRepository
        .createQueryBuilder('notes')
        .select('notes.id', 'id')
        .addSelect("notes.createdAt", 'createdAt')
        .addSelect("notes.notes", "notes")
        .addSelect("usr.firstName", "firstname")
        .addSelect("usr.lastName", "lastname")
        .leftJoin('users', 'usr', 'usr.id = notes.createdBy')
        .where('notes.notesStatus = 1')
        .andWhere("notes.residentCompanyId = :residentCompanyId", { residentCompanyId: 1 })
        .orderBy("notes.createdAt", "DESC")
        .getRawMany();
      //jest.spyOn(notesRepository, 'createQueryBuilder').mockReturnValueOnce(mockNotes);
      let result = await residentCompanyService.getNoteByCompanyId(mockRC.id);
      expect(result).not.toBeNull();
    })
    it('it should throw exception if note is not added  ', async () => {
      jest.spyOn(notesRepository, 'createQueryBuilder').mockReturnValue(new BiolabsException('Getting error in find the note'));
      try {
        await residentCompanyService.getNoteByCompanyId(mockRC.id);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toEqual('Getting error in find the note');
      }
    });
  });
  describe('addNote method', () => {
    const req: any = {
      user: { site_id: [1, 2], role: 1 }
    };
    const payload: AddNotesDto = { "companyId": 1, "notes": "this is note 1" };
    it('should add note data ', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      const note = new Notes();
      note.createdBy = req.user.id;
      note.notes = payload.notes;
      note.residentCompany = mockRC;
      jest.spyOn(notesRepository, 'save').mockResolvedValueOnce(mockNotes);
      const notes = await residentCompanyService.addNote(payload, req);
      expect(notes).not.toBeNull();
      expect(notes).toBe(mockNotes);
    })

    it('it should throw exception if note is not added  ', async () => {
      jest.spyOn(notesRepository, 'save').mockRejectedValueOnce(new InternalException('Error in add note'));
      try {
        await residentCompanyService.addNote(payload, req);
      } catch (e) {
        expect(e.name).toBe('InternalException');
        expect(e instanceof InternalException).toBeTruthy();
      }
    });
  });
  describe('getResidentCompanySpecificFieldsById method', () => {
    it('should get  getResidentCompanySpecificFieldsById', async () => {
      jest.spyOn(residentCompanyService, 'checkIfValidSiteIds').mockReturnThis();
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(mockRC);
      const result = await residentCompanyService.getResidentCompanySpecificFieldsById(70, req);

      expect(result).not.toBeUndefined();
      expect(result).not.toBeNull();
    })
    it('should throw exception if company with provided id not available.', async () => {
      let companyId = 70;
      jest.spyOn(residentCompanyService, 'checkIfValidSiteIds').mockReturnThis();
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValueOnce(null);
      try {
        await residentCompanyService.getResidentCompanySpecificFieldsById(companyId, req);
      } catch (e) {
        expect(e.status).toEqual(406);
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe(`Resident Company not found by id: ${companyId}`)
      }
    });
  });
  describe('softDeleteNote method', () => {
    it('should delete data based on id', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(mockNotes);
      jest.spyOn(notesRepository, 'save').mockResolvedValueOnce(mockNotes);
      let result = await residentCompanyService.softDeleteNote(mockNotes.id);
      expect(result['message']).toEqual('Note deleted succesfully');
      expect(result['status']).toEqual('Success');

    })
    it('it should throw exception  ', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(mockNotes);
      jest.spyOn(notesRepository, 'save').mockRejectedValueOnce(mockNotes);
      let result = await residentCompanyService.softDeleteNote(mockNotes.id);
      expect(result['message']).toEqual('Error in soft delete note');
      expect(result['status']).toEqual('Error');
    });
    it('it should throw exception if note id is available ', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(null);
      let result = await residentCompanyService.softDeleteNote(mockNotes.id);
      expect(result['message']).toEqual('Note with provided id not available.');
      expect(result['status']).toEqual('Not acceptable');
    });
  });
  describe('updateNote method', () => {
    let payload: UpdateNotesDto = { "notes": "this is note 1" };
    it('should update note based on id', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(mockNotes);
      if (mockNotes) {
        jest.spyOn(notesRepository, 'update').mockReturnThis();
      }
      let result = await residentCompanyService.updateNote(payload, mockNotes.id);
      expect(result['message']).toEqual('Note Updated succesfully');
      expect(result['status']).toEqual('Success');
    })
    it('it should throw exception  ', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(mockNotes);
      jest.spyOn(notesRepository, 'update').mockRejectedValueOnce(mockNotes);
      let result = await residentCompanyService.updateNote(payload, mockNotes.id);
      expect(result['message']).toEqual('Error while  Updating  note');
      expect(result['status']).toEqual('Error');
    });
    it('it should throw exception if note id is available ', async () => {
      jest.spyOn(notesRepository, 'findOne').mockResolvedValueOnce(null);
      let result = await residentCompanyService.updateNote(payload, mockNotes.id);
      expect(result['message']).toEqual('Note with provided id not available.');
      expect(result['status']).toEqual('Not acceptable');
    });
  })
  describe('softDeleteMember method', () => {
    let mockRcAdvisors: ResidentCompanyAdvisory = { "id": 1, "companyId": 1, "name": "Antibody", "title": "Test", "status": "0", "organization": "1", "createdAt": 1600000, "updatedAt": 16000000 };
    it('should delete data based on id', async () => {
      jest.spyOn(residentCompanyAdvisoryRepository, 'findOne').mockResolvedValueOnce(mockRcAdvisors);
      jest.spyOn(residentCompanyAdvisoryRepository, 'save').mockResolvedValueOnce(mockRcAdvisors);
      const notes = await residentCompanyService.softDeleteMember(1, "advisors");
      expect(notes).toBe(mockRcAdvisors);
    })

    it('it should throw exception if member id is not provided  ', async () => {
      jest.spyOn(residentCompanyAdvisoryRepository, 'findOne').mockResolvedValueOnce(null);
      try {
        await residentCompanyService.softDeleteMember(1, "advisors");
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe('Member with provided id not available.');
        expect(e.response.statusCode).toBe(406);
      }
    });
    it('should delete data based on id', async () => {
      jest.spyOn(residentCompanyManagementRepository, 'findOne').mockResolvedValueOnce(mockResidentManagement);
      jest.spyOn(residentCompanyManagementRepository, 'save').mockResolvedValueOnce(mockResidentManagement);
      const notes = await residentCompanyService.softDeleteMember(1, "managements");
      expect(notes).toBe(mockResidentManagement);
    })

    it('it should throw exception if member id is not provided  ', async () => {
      jest.spyOn(residentCompanyManagementRepository, 'findOne').mockResolvedValueOnce(null);
      try {
        await residentCompanyService.softDeleteMember(1, "managements");
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe('Member with provided id not available.');
        expect(e.response.statusCode).toBe(406);
      }
    });
    it('should delete data based on id', async () => {
      jest.spyOn(residentCompanyTechnicalRepository, 'findOne').mockResolvedValueOnce(mockResidentTechnical);
      jest.spyOn(residentCompanyTechnicalRepository, 'save').mockResolvedValueOnce(mockResidentTechnical);
      const notes = await residentCompanyService.softDeleteMember(1, "technicals");
      expect(notes).toBe(mockResidentTechnical);
    })

    it('it should throw exception if member id is not provided  ', async () => {
      jest.spyOn(residentCompanyTechnicalRepository, 'findOne').mockResolvedValueOnce(null);
      try {
        await residentCompanyService.softDeleteMember(1, "technicals");
      } catch (e) {
        expect(e.response.error).toBe('Not Acceptable');
        expect(e.response.message).toBe('Member with provided id not available.');
        expect(e.response.statusCode).toBe(406);
      }
    });
  });

  describe('getStagesOfTechnologyBySiteId method', () => {
    let mockStagesOfTechnologies = [
      {
        "stage": 2,
        "name": "Proof-of-principal/Validation",
        "quarterno": 2,
        "quat": "Q2.2021"
      },
      {
        "stage": 2,
        "name": "Proof-of-principal/Validation",
        "quarterno": 3,
        "quat": "Q3.2021"
      }
    ];

    it('should return object', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mockStagesOfTechnologies);
      let result = await residentCompanyService.getStagesOfTechnologyBySiteId(1, 1);
      expect(result).not.toBeNull();
      expect(result).toEqual({
        stagesOfTechnology: [
          {
            "stage": 2,
            "name": "Proof-of-principal/Validation",
            "quarterno": 2,
            "quat": "Q2.2021"
          },
          {
            "stage": 2,
            "name": "Proof-of-principal/Validation",
            "quarterno": 3,
            "quat": "Q3.2021"
          }
        ]
      });
    })
    it('should throw exception if Getting error in find the stages of technology', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockImplementation(() => {
        throw new BiolabsException('Getting error in find the stages of technology')
      });
      try {
        await residentCompanyService.getStagesOfTechnologyBySiteId(1, 1);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Getting error in find the stages of technology');
      }
    });
  });
  describe('getFundingBySiteIdAndCompanyId method', () => {
    const mockfundings =
      [
        {
          "Funding": "12",
          "quarterNo": 3,
          "quaterText": "Q3.2021"
        }
      ]

    it('should return object', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mockfundings);
      let result = await residentCompanyService.getFundingBySiteIdAndCompanyId(1, 1);
      expect(result).not.toBeNull();
      expect(result).toEqual({
        fundings: [{ Funding: '12', quarterNo: 3, quaterText: 'Q3.2021' }]
      });
    })
    it('should throw exception if Getting error in find the fundings', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockImplementation(() => {
        throw new BiolabsException('Getting error in find the fundings')
      });
      try {
        await residentCompanyService.getFundingBySiteIdAndCompanyId(1, 1);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Getting error in find the fundings');
      }
    });
  });
  describe('getFeeds method', () => {
    const mockFeeds = [
      {
        "feeds": "R&D path & commercialization plan changed ",
        "beforevalue": "Blue Line",
        "aftervalue": "the stargazer snake eel, is a marine fish belonging to the family Ophichthidae. It is native to shallow tropical and subtropical waters in the western Indo-Pacific region. It hunts at night for crustaceans and small fish, after which it submerges itself into the sediment tail first and remains there all day, with just its eyes and the top of its head projecting, as seen here in Batangas Bay in the Philippines.",
        "cdate": "08/04/2021"
      },
      {
        "feeds": "Funding Source changed ",
        "beforevalue": "Angel Investors(including friends and family),Grant funded,Seed-Funding",
        "aftervalue": "Other",
        "cdate": "08/04/2021"
      },
      {
        "feeds": "Funding Source changed to other",
        "beforevalue": "-",
        "aftervalue": "funding source today",
        "cdate": "08/04/2021"
      },
      {
        "feeds": "Intellectual property related to your technology changed ",
        "beforevalue": "1",
        "aftervalue": "9999",
        "cdate": "08/04/2021"
      },
      {
        "feeds": "Intellectual property related to your technology changed to other ",
        "beforevalue": "intellectual 4th aug",
        "aftervalue": "intellectual 4th aug1",
        "cdate": "08/04/2021"
      },
      {
        "feeds": "Intellectual property related to your technology changed ",
        "beforevalue": "9999",
        "aftervalue": "1",
        "cdate": "08/04/2021"
      },
      {
        "feeds": "Intellectual property related to your technology changed ",
        "beforevalue": "1",
        "aftervalue": "9999",
        "cdate": "08/04/2021"
      },
      {
        "feeds": "Intellectual property related to your technology changed to other ",
        "beforevalue": "-",
        "aftervalue": "intellectual 4th aug",
        "cdate": "08/04/2021"
      },
      {
        "feeds": "Company size changed ",
        "beforevalue": "6",
        "aftervalue": "5",
        "cdate": "08/02/2021"
      },
      {
        "feeds": "Published papers related to your technology changed ",
        "beforevalue": "No",
        "aftervalue": "Yes",
        "cdate": "08/02/2021"
      },
      {
        "feeds": "Funding changed ",
        "beforevalue": "1000",
        "aftervalue": "10000",
        "cdate": "08/02/2021"
      },
      {
        "feeds": "Company size changed ",
        "beforevalue": "0",
        "aftervalue": "6",
        "cdate": "08/02/2021"
      },
      {
        "feeds": "Affiliated Institution changed ",
        "beforevalue": "Blue Line",
        "aftervalue": "Blue Line inst",
        "cdate": "08/02/2021"
      }
    ]
    it('should return object', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mockFeeds);
      let result = await residentCompanyService.getFeeds(1, 1);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result).toEqual(mockFeeds);
    })
    it('should throw exception', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockRejectedValueOnce(null);
      try {
        await residentCompanyService.getFeeds(1, 1);

      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Getting error in updating feeds');
      }
    })
    it('should throw exception if Getting error  in forget password process', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockImplementation(() => {
        throw new BiolabsException('Getting error in updating feeds')
      });
      try {
        await residentCompanyService.getFeeds(1, 1);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Getting error in updating feeds');
      }
    });
  });

  describe('getstartedWithBiolabs method', () => {
    const mockStartBiolabs = [
      {
        startwithbiolabs: "2021-07-06T11:25:57.685Z",
      }
    ]
    it('should return object', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mockStartBiolabs);
      let result = await residentCompanyService.getstartedWithBiolabs(1, 1);
      expect(result).not.toBeNull();
      expect(result[0]).toEqual(mockStartBiolabs[0]);
      expect(result).toEqual(mockStartBiolabs);
    })
    it('should throw exception if Getting error in find the history of started with Biolabs analysis', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockImplementation(() => {
        throw new BiolabsException('Getting error in find the history of started with Biolabs analysis')
      });
      try {
        await residentCompanyService.getstartedWithBiolabs(1, 1);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Getting error in find the history of started with Biolabs analysis');
      }
    });
  });

  describe('getFinancialFees method', () => {
    const mockFinancialFees = [
      {
        "productTypeId": 1,
        "sum": "700"
      },
      {
        "productTypeId": 2,
        "sum": "148"
      },
      {
        "productTypeId": 5,
        "sum": "200"
      },

    ]
    it('should return array of financial fees', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mockFinancialFees);
      let result = await residentCompanyService.getFinancialFees(1)
      expect(result).not.toBeNull();
      expect(result[0]).toEqual(mockFinancialFees[0]);
      expect(result[1]).toEqual(mockFinancialFees[1]);
      expect(result.length).toEqual(mockFinancialFees.length);
      expect(result).toEqual(mockFinancialFees);
    })
    it('should throw exception if Getting error in find the financial fees', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockImplementation(() => {
        throw new BiolabsException('Getting error in find the financial fees')
      });
      try {
        await residentCompanyService.getFinancialFees(1);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Getting error in find the financial fees');
      }
    });
  });
  describe('timelineAnalysis method', () => {
    const mocktimeAnalysis = [
      {
        "productTypeId": 2,
        "sumofquantity": "4",
        "quarterno": 2,
        "quat": "Q2.2021"
      },
      {
        "productTypeId": 4,
        "sumofquantity": "13",
        "quarterno": 2,
        "quat": "Q2.2021"
      },
      {
        "productTypeId": 4,
        "sumofquantity": "31",
        "quarterno": 3,
        "quat": "Q3.2021"
      }
    ]
    it('should return array of timeline history', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mocktimeAnalysis);
      let result = await residentCompanyService.timelineAnalysis(1);
      expect(result).not.toBeNull();
      expect(result[0]).toEqual(mocktimeAnalysis[0]);
      expect(result[1]).toEqual(mocktimeAnalysis[1]);
      expect(result).toEqual(mocktimeAnalysis);
    })
  });

  describe('getCompanySizeQuartly method', () => {
    const mockCompanySizeQuarter = [
      {
        "noofemployees": 25,
        "quarterno": 1,
        "quat": "Q1.2021"
      },
      {
        "noofemployees": 80,
        "quarterno": 2,
        "quat": "Q2.2021"
      },
      {
        "noofemployees": 25,
        "quarterno": 3,
        "quat": "Q3.2021"
      }
    ]
    it('should return array of resident company history', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mockCompanySizeQuarter);
      let result = await residentCompanyService.getCompanySizeQuartly(1);
      expect(result).not.toBeNull();
      expect(result[0]).toEqual(mockCompanySizeQuarter[0]);
      expect(result[1]).toEqual(mockCompanySizeQuarter[1]);
      expect(result).toEqual(mockCompanySizeQuarter);
    })
    it('should throw exception if Getting error in find the fundings', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockImplementation(() => {
        throw new BiolabsException('Getting error in find company size quartly')
      });
      try {
        await residentCompanyService.getCompanySizeQuartly(1);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toBe('Getting error in find company size quartly');
      }
    });
  });
  describe('checkEmptyVal method', () => {
    let data: any = {
      id: 1, email: "elon@space.com", companyId: 1, name: "TestAdmin", status: '1',
      title: "ResidentManage", phone: "8055969426", linkedinLink: "testAmin@linkedin.in", publications: "Management",
      academicAffiliation: "Test", joiningAsMember: true, mainExecutivePOC: true,
      laboratoryExecutivePOC: true, invoicingExecutivePOC: true
    }

    it("should check if type advisors should not be null", async () => {
      {
        let type = "advisors";
        if (type == 'advisors' && (data.name || data.title || data.organization)) {
          return true;
        }
        await residentCompanyService.checkEmptyVal(type, data);
      }
    });
    it("should check if type managements should not be null", async () => {

      let type = "managements";
      if (type == 'managements' &&
        (data.email || data.emergencyExecutivePOC || data.invoicingExecutivePOC || data.joiningAsMember
          || data.laboratoryExecutivePOC || data.linkedinLink || data.name || data.phone || data.publications || data.title)) {
        return true;
      }
      await residentCompanyService.checkEmptyVal(type, data);


    });
    it("should check if type technicals should not be null", async () => {
      let type = "technicals";
      if (type == 'technicals' &&
        (data.email || data.emergencyExecutivePOC || data.invoicingExecutivePOC || data.joiningAsMember
          || data.laboratoryExecutivePOC || data.linkedinLink || data.name || data.phone || data.publications || data.title)) {
        return true;
      }
      await residentCompanyService.checkEmptyVal(type, data);

    });
  });

  describe('getSpaceChangeWaitlistItems method', () => {

    it('should return list of items', async () => {
      jest.spyOn(residentCompanyService, 'checkIfValidSiteIds').mockReturnThis();
      jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mockSpaceChangeWaitlistItems);
      let result = await residentCompanyService.getSpaceChangeWaitlistItems(70, req);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result).toEqual({
        items: [
          { productTypeId: 5, sum: '0', productTypeName: 'Private Lab' },
          { productTypeId: 4, sum: '2', productTypeName: 'Private Office' },
          { productTypeId: 3, sum: '4', productTypeName: 'Workstation' },
          { productTypeId: 2, sum: '1', productTypeName: 'Lab Bench' },
          { productTypeId: 1, sum: '0', productTypeName: 'Membership Fee' }
        ]
      });
    })
  })
  describe('getSpaceChangeWaitListById method', () => {

    it('should return array of resident company history', async () => {
      jest.spyOn(spaceChangeWaitlistRepository, 'findOne').mockReturnValueOnce(mockSpaceChangeWaitlistItem);
      let result = await residentCompanyService.getSpaceChangeWaitListById(1);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined()
      expect(result).toEqual(mockSpaceChangeWaitlistItem);
    })
    it('should throw exception', async () => {
      jest.spyOn(spaceChangeWaitlistRepository, 'findOne').mockResolvedValueOnce(null);
      let result = await residentCompanyService.getSpaceChangeWaitListById(1);
      expect(result['message']).toEqual('Space Change Waitlist not found by id: 1');
      expect(result['status']).toEqual('error');
    })
  });
  describe('updateSpaceChangeWaitlistPriorityOrder method', () => {
    let payload: UpdateWaitlistPriorityOrderDto = {
      spaceChangeWaitlistIds: [
        1, 2, 3
      ]
    }
    it('should return response with status and message fields', async () => {

      if (payload && payload.spaceChangeWaitlistIds.length > 0) {
        for (let index = 0; index < payload.spaceChangeWaitlistIds.length; index++) {
          jest.spyOn(spaceChangeWaitlistRepository, 'findOne').mockResolvedValue(mockSpaceChangeWaitlistItem);
          mockSpaceChangeWaitlistItem.priorityOrder = index;
          jest.spyOn(spaceChangeWaitlistRepository, 'update').mockResolvedValue(mockSpaceChangeWaitlistItem);
        }
      }
      let result = await residentCompanyService.updateSpaceChangeWaitlistPriorityOrder(payload);
      expect(result['message']).toEqual('Priority Order updated successfully');
      expect(result['status']).toEqual('Success');
    });
    it('should return response with status and message fields', async () => {
      if (payload && payload.spaceChangeWaitlistIds.length > 0) {
        for (let index = 0; index < payload.spaceChangeWaitlistIds.length; index++) {
          jest.spyOn(spaceChangeWaitlistRepository, 'findOne').mockResolvedValue(null);
          jest.spyOn(spaceChangeWaitlistRepository, 'update').mockResolvedValue(null);
        }
      }
      let result = await residentCompanyService.updateSpaceChangeWaitlistPriorityOrder(payload);
      expect(result['message']).toEqual('Could not update Priority Order');
      expect(result['status']).toEqual('Fail');
    });
    it('should return response with status and message fields', async () => {
      payload = {
        spaceChangeWaitlistIds: []
      }
      if (payload && payload.spaceChangeWaitlistIds.length < 0) {
      }
      let result = await residentCompanyService.updateSpaceChangeWaitlistPriorityOrder(payload);
      expect(result['message']).toEqual('Please provide proper Space Change Waitlist ids');
      expect(result['status']).toEqual('Not acceptable');
    });
  });
  describe('updateSpaceChangeWaitlistStatus method', () => {
    let payload: UpdateWaitlistRequestStatusDto = {
      id: 1,
      status: 1
    }
    const req: any = {
      user: { site_id: [1, 2], role: 1 },
      headers: { 'x-site-id': [2] }
    }
    let mockCount: any;
    it('should return response with status and message fields if it is Successfull', async () => {
      mockCount = 1;
      jest.spyOn(spaceChangeWaitlistRepository, 'count').mockResolvedValue(mockCount);
      if (mockCount > 1) {
        jest.spyOn(spaceChangeWaitlistRepository, 'createQueryBuilder').mockReturnValueOnce(mockSpaceChangeWaitlistItem);
      }
      let result = await residentCompanyService.updateSpaceChangeWaitlistStatus(payload, req);
      expect(result['message']).toEqual('Status updated successfully');
      expect(result['status']).toEqual('Success');
      expect(result['body']).toEqual({ id: 1, status: 1 });
    });
    it('should throw Error', async () => {
      mockCount = 0;
      jest.spyOn(spaceChangeWaitlistRepository, 'count').mockResolvedValue(mockCount);
      let result = await residentCompanyService.updateSpaceChangeWaitlistStatus(payload, req);
      expect(result['message']).toEqual('Space Change Waitlist not found by id : 1');
      expect(result['status']).toEqual('Error');
      expect(result['body']).toEqual({ id: 1, status: 1 });
    });
    it('should throw Error', async () => {
      jest.spyOn(spaceChangeWaitlistRepository, 'count').mockRejectedValueOnce(mockCount);
      let result = await residentCompanyService.updateSpaceChangeWaitlistStatus(payload, req);
      expect(result['message']).toEqual('Error while updating status');
      expect(result['status']).toEqual('Error');
      expect(result['body']).toEqual(0);
    });
  });

  describe('getItems method', () => {
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(itemRepository, 'find').mockResolvedValue(mockSpaceChangeWaitlistItem.items);
      let result = await residentCompanyService.getItems(1, itemsWithUpdatedInvoices);
      expect(result).not.toBeNull();
      expect(result).not.toBeUndefined();
      expect(result.length).toBe(mockSpaceChangeWaitlistItem.items.length);
      expect(result).toBe(mockSpaceChangeWaitlistItem.items);
    });
  });

  describe('getItemsOfSpaceChangeWaitlist method', () => {
    let spaceChangeWaitlist = [{
      residentCompanyName: 'BiolabsNewvision_Ipsen',
      id: 1,
      dateRequested: 2021,
      desiredStartDate: 1627603200,
      planChangeSummary: '',
      requestedBy: 'BiolabsNewvision',
      requestStatus: 0,
      fulfilledOn: 946665000,
      isRequestInternal: true,
      requestNotes: 'need 1 more for membership fee and 1 more for private fee',
      internalNotes: '',
      siteNotes: '',
      priorityOrder: 1,
      site: [2],
      membershipChange: 0,
      requestGraduateDate: 946665000,
      marketPlace: true,
      createdAt: 2021,
      updatedAt: 2021,
      residentCompanyId: 125
    },
    {
      residentCompanyName: 'BiolabsNewvision_Ipsen',
      id: 2,
      dateRequested: 2021,
      desiredStartDate: 1627516800,
      planChangeSummary: '',
      requestedBy: 'BiolabsNewvision',
      requestStatus: 0,
      fulfilledOn: 946665000,
      isRequestInternal: true,
      requestNotes: '',
      internalNotes: '',
      siteNotes: '',
      priorityOrder: 3,
      site: [2],
      membershipChange: 0,
      requestGraduateDate: 946665000,
      marketPlace: true,
      createdAt: 2021,
      updatedAt: 2021,
      residentCompanyId: 1
    }
    ];

    it('should return response with status and message fields if it is Successfull', async () => {
      if (spaceChangeWaitlist) {
        // for (let index = 0; index < spaceChangeWaitlist.length; index++) {
        jest.spyOn(residentCompanyHistoryRepository, 'query').mockResolvedValue(mockSpaceChangeWaitlistItems);
        jest.spyOn(itemRepository, 'find').mockResolvedValue(mockSpaceChangeWaitlistItem.items);
        jest.spyOn(residentCompanyService, 'getSpaceChangeWaitlistItems').mockReturnThis();
        // jest.spyOn(residentCompanyService, 'getItems').mockReturnThis();
        jest.spyOn(residentCompanyService, 'getItems').mockResolvedValue(mockSpaceChangeWaitlistItems);
      }
      let result = await residentCompanyService.getItemsOfSpaceChangeWaitlist(spaceChangeWaitlist, req);
      expect(result).not.toBeUndefined();
      expect(result).not.toBeNull();
      expect(result.length).toEqual(2);
    });

    it('should return response with status and message fields if it is Successfull', async () => {
      if (spaceChangeWaitlist) {
        for (let index = 0; index < spaceChangeWaitlist.length; index++) {
          jest.spyOn(itemRepository, 'find').mockRejectedValueOnce(null);
        }
        jest.spyOn(residentCompanyService, 'getSpaceChangeWaitlistItems').mockReturnThis();
      }
      try {
        await residentCompanyService.getItemsOfSpaceChangeWaitlist(spaceChangeWaitlist, req);
      } catch (e) {
        expect(e.status).toBe(500);
        expect(e.response.status).toBe('Error');
        expect(e.response.message).toEqual('Problem in fetching Items for Space Change Waitlist');
      }
    });
  });

  describe('updateSpaceChangeWaitlistItems method', () => {
    it('should return response with status and message fields if it is Successfull', async () => {
      if (mockUpdateSpaceChangeWaitlistDto.items && mockUpdateSpaceChangeWaitlistDto.items.length) {
        jest.spyOn(itemRepository, 'delete').mockResolvedValue(mockSpaceChangeWaitlistItem);
        jest.spyOn(itemRepository, 'save').mockResolvedValue(mockSpaceChangeWaitlistItem);
        jest.spyOn(residentCompanyService, 'sendEmailToSiteAdmin').mockReturnThis();
      }
      await residentCompanyService.updateSpaceChangeWaitlistItems(mockUpdateSpaceChangeWaitlistDto, mockSpaceChangeWaitlistItem);
    });
    it('should return response with status and message fields if it is Successfull', async () => {
      if (mockUpdateSpaceChangeWaitlistDto.items && mockUpdateSpaceChangeWaitlistDto.items.length) {
        jest.spyOn(itemRepository, 'delete').mockRejectedValueOnce(null);
        // jest.spyOn(itemRepository, 'save').mockResolvedValue(mockSpaceChangeWaitlistItem);
      }
      try {
        await residentCompanyService.updateSpaceChangeWaitlistItems(mockUpdateSpaceChangeWaitlistDto, mockSpaceChangeWaitlistItem);
      } catch (e) {
        expect(e.status).toBe(500);
        expect(e.response.status).toBe('Error');
        expect(e.response.message).toEqual('Error in updating Space Change Waitlist items');
      }
    });
    it('should return response with status and message fields if it is Successfull', async () => {
      if (mockUpdateSpaceChangeWaitlistDto.items && mockUpdateSpaceChangeWaitlistDto.items.length) {
        jest.spyOn(itemRepository, 'delete').mockResolvedValue(mockSpaceChangeWaitlistItem);
        jest.spyOn(itemRepository, 'save').mockRejectedValueOnce(mockSpaceChangeWaitlistItem.items);
      }
      try {
        await residentCompanyService.updateSpaceChangeWaitlistItems(mockUpdateSpaceChangeWaitlistDto, mockSpaceChangeWaitlistItem);
      } catch (e) {
        expect(e.status).toBe(500);
        expect(e.response.status).toBe('Error');
        expect(e.response.message).toEqual('Error in updating Space Change Waitlist item');
      }
    });
  });
  describe('updateSpaceChangeWaitlistItems method', () => {
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(residentCompanyHistoryRepository, 'save').mockResolvedValue(mockResidentHistory);
      await residentCompanyService.updateCompanyHistoryAfterSavingSpaceChangeWaitlist(mockUpdateSpaceChangeWaitlistDto, mockSpaceChangeWaitlistItem.residentCompany);
    });
  });
  describe('updateSpaceChangeWaitlist method', () => {
    const req: any = {
      user: { site_id: [1, 2], role: 1 },
      headers: { 'x-site-id': [2] }
    }
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }

    it('should return response with status and message fields if it is Successfull', async () => {
      if (mockUpdateSpaceChangeWaitlistDto) {
        jest.spyOn(spaceChangeWaitlistRepository, 'findOne').mockResolvedValue(mockSpaceChangeWaitlistItem);
      }
      jest.spyOn(spaceChangeWaitlistRepository, 'update').mockResolvedValue(mockSpaceChangeWaitlistItem);
      jest.spyOn(residentCompanyService, 'updateSpaceChangeWaitlistItems').mockResolvedValue(mockSpaceChangeWaitlistItem);
      jest.spyOn(residentCompanyRepository, 'update').mockResolvedValue(mockSpaceChangeWaitlistItem.residentCompany);
      jest.spyOn(residentCompanyHistoryRepository, 'save').mockResolvedValue(mockResidentHistory);
      let result = await residentCompanyService.updateSpaceChangeWaitlist(mockUpdateSpaceChangeWaitlistDto, siteIdArr, req);
      expect(result['message']).toEqual('Space Change Waitlist updated successfully');
      expect(result['status']).toEqual('Success');
    });
    // it('should return response with status and message fields if it is Successfull', async () => {
    //   if (mockUpdateSpaceChangeWaitlistDto) {
    //     jest.spyOn(spaceChangeWaitlistRepository, 'findOne').mockRejectedValueOnce(new HttpException(''));

    //   }
    //   jest.spyOn(spaceChangeWaitlistRepository, 'update').mockRejectedValueOnce(mockSpaceChangeWaitlistItem);
    //   jest.spyOn(residentCompanyService, 'updateSpaceChangeWaitlistItems').mockRejectedValueOnce(mockSpaceChangeWaitlistItem);
    //   jest.spyOn(residentCompanyRepository, 'update').mockRejectedValueOnce(mockSpaceChangeWaitlistItem.residentCompany);
    //   jest.spyOn(residentCompanyHistoryRepository, 'save').mockRejectedValueOnce(mockResidentHistory);
    //    try {
    //     let result = await residentCompanyService.updateSpaceChangeWaitlist(mockUpdateSpaceChangeWaitlistDto);
    //     console.log(result);
    //   } catch (error) {
    //     console.log(error);

    //   }

    //   // expect(result['message']).toEqual('Space Change Waitlist updated successfully');
    //   // expect(result['status']).toEqual('Success');
    // });

  });
  describe('addResidentCompanyDataInWaitlist method', () => {
    const mockProductType: ProductType = {
      "productTypeName": "TestProduct",
      "createdBy": 1,
      "modifiedBy": 1,
      "id": 1,
      "createdAt": new Date("2021-07-14"),
      "modifiedAt": new Date("2021-07-14")
    }
    const mockProductType2 = {
      "id": 2,
      "productTypeName": "Lab Bench",
      "createdBy": 1,
      "modifiedBy": 1,
      "createdAt": "2021-07-06T11:23:14.174Z",
      "modifiedAt": "2021-07-06T11:23:14.174Z"
    }
    let producttypes: Array<any> = [{ mockProductType, mockProductType2 }];
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockResolvedValue(5);
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockResolvedValue(mockSpaceChangeWaitlistItem);
      jest.spyOn(productTypeService, 'getProductType').mockResolvedValue(mockSpaceChangeWaitlistItems);
      let result = await residentCompanyService.addResidentCompanyDataInWaitlist(mockRC);
      expect(result).not.toBeNull();
      expect(result).not.toBeNull();
    });
    it('should throw BiolabsException exception', async () => {
      jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockRejectedValueOnce(new BiolabsException('Getting error while fetching  maxPriorityOrder '));
      jest.spyOn(productTypeService, 'getProductType').mockResolvedValue(mockSpaceChangeWaitlistItems);
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockResolvedValue(mockSpaceChangeWaitlistItem);
      try {
        await residentCompanyService.addResidentCompanyDataInWaitlist(mockRC);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toEqual("Getting error while fetching  maxPriorityOrder ");
      }
    });

    it('should throw BiolabsException exception in fetching product types', async () => {
      jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockResolvedValue(5);
      jest.spyOn(productTypeService, 'getProductType').mockRejectedValue(mockSpaceChangeWaitlistItems);
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockResolvedValue(mockSpaceChangeWaitlistItem);

      try {
        await residentCompanyService.addResidentCompanyDataInWaitlist(mockRC);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toEqual("Error while fetching product types");
      }
    });

    it('should throw BiolabsException exception', async () => {
      jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockResolvedValue(5);
      jest.spyOn(productTypeService, 'getProductType').mockResolvedValue(mockSpaceChangeWaitlistItems);
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockRejectedValue(mockSpaceChangeWaitlistItem);
      try {
        await residentCompanyService.addResidentCompanyDataInWaitlist(mockRC);
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toEqual('Getting error while Saving Waitlist ');
      }

    });
  });
  describe('addToSpaceChangeWaitList method', () => {
    let payload: AddSpaceChangeWaitlistDto = {
      requestStatus: 0,
      isRequestInternal: true,
      membershipChange: 0,
      graduateDescription: "graduated",
      desiredStartDate: 1627603200,
      items: [
        {
          itemName: 'Private Office',
          currentQty: null,
          productTypeId: 4,
          desiredQty: 12
        },
        {
          itemName: 'Workstation',
          currentQty: null,
          productTypeId: 3,
          desiredQty: 12
        },
        {
          itemName: 'Private Lab',
          currentQty: null,
          productTypeId: 5,
          desiredQty: 20
        },
        {
          itemName: 'Lab Bench',
          currentQty: null,
          productTypeId: 2,
          desiredQty: 10
        },
        {
          itemName: 'Membership Fee',
          currentQty: null,
          productTypeId: 1,
          desiredQty: 32
        },
        {
          itemName: 'TestProduct',
          currentQty: null,
          productTypeId: 8,
          desiredQty: 11
        }
      ],
      requestNotes: 'This is notes1',
      planChangeSummary: '',
      fulfilledOn: 946665000,
      siteNotes: '',
      residentCompanyId: 1,
      companyStage: 3,
      companySize: 120,
      funding: '12',
      fundingSource: [1, 2],
      internalNotes: '',
      shareYourProfile: false,
      requestGraduateDate: 946665000,
      marketPlace: true
    }
    const req: any = {
      user: { site_id: [1, 2], role: 1 },
      headers: { 'x-site-id': [2] }
    }
    let siteIdArr = req.user.site_id;
    if (req.headers['x-site-id']) {
      siteIdArr = JSON.parse(req.headers['x-site-id'].toString());
    }
    const maxPriorityOrder = 5;
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (payload.requestStatus == 0) {
        jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockResolvedValue(maxPriorityOrder);
      }
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockResolvedValue(mockSpaceChangeWaitlistItem);

      mockRC.companyStage = payload.companyStage;
      mockRC.funding = payload.funding;
      mockRC.fundingSource = payload.fundingSource;
      mockRC.companySize = payload.companySize;
      mockRC.shareYourProfile = payload.shareYourProfile;
      jest.spyOn(residentCompanyRepository, 'update').mockResolvedValue(mockSpaceChangeWaitlistItem.residentCompany);

      let result = await residentCompanyService.addToSpaceChangeWaitList(payload, siteIdArr, req);
      expect(result['message']).toEqual('Operation Successful');
      expect(result['status']).toEqual('Success');
    });
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(null);
      if (payload.requestStatus == 0) {
        jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockResolvedValue(maxPriorityOrder);
      }
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockResolvedValue(mockSpaceChangeWaitlistItem);
      jest.spyOn(residentCompanyRepository, 'update').mockResolvedValue(mockSpaceChangeWaitlistItem.residentCompany);
      let result = await residentCompanyService.addToSpaceChangeWaitList(payload, siteIdArr, req);
      expect(result['message']).toEqual('Resident Company not found by id: 1');
      expect(result['status']).toEqual('Error');
    });
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (payload.requestStatus == 0) {
        jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockRejectedValueOnce(maxPriorityOrder);
      }
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockResolvedValue(mockSpaceChangeWaitlistItem);
      jest.spyOn(residentCompanyRepository, 'update').mockResolvedValue(mockSpaceChangeWaitlistItem.residentCompany);
      try {
        await residentCompanyService.addToSpaceChangeWaitList(payload, siteIdArr, req);
      } catch (e) {
        expect(e.status).toBe(500);
        expect(e.response.status).toBe('Error');
        expect(e.response.message).toEqual('Error while fetching Max Priority Order to set in new Space Change Waitlist record');
      }
    });
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (payload.requestStatus == 0) {
        jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockResolvedValue(maxPriorityOrder);
      }
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockRejectedValueOnce(mockSpaceChangeWaitlistItem);
      jest.spyOn(residentCompanyRepository, 'update').mockResolvedValue(mockSpaceChangeWaitlistItem.residentCompany);
      try {
        await residentCompanyService.addToSpaceChangeWaitList(payload, siteIdArr, req);
      } catch (e) {
        expect(e.status).toBe(400);
        expect(e.response.status).toBe('Error');
        expect(e.response.message).toEqual('Could not save Space Change Waitlist record');
      }
    });
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (payload.requestStatus == 0) {
        jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockResolvedValue(maxPriorityOrder);
      }
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockResolvedValueOnce(mockSpaceChangeWaitlistItem);
      jest.spyOn(residentCompanyRepository, 'update').mockRejectedValueOnce(mockSpaceChangeWaitlistItem.residentCompany);
      try {
        await residentCompanyService.addToSpaceChangeWaitList(payload, siteIdArr, req);
      } catch (e) {
        expect(e.status).toBe(500);
        expect(e.response.status).toBe('Error');
        expect(e.response.message).toEqual('Could not update Resident Company record');
      }
    });
    it('should return response with status and message fields if it is Successfull', async () => {
      jest.spyOn(residentCompanyRepository, 'findOne').mockResolvedValue(mockRC);
      if (payload.requestStatus == 0) {
        jest.spyOn(residentCompanyService, 'fetchMaxPriorityOrderOfWaitlist').mockResolvedValue(maxPriorityOrder);
      }
      jest.spyOn(spaceChangeWaitlistRepository, 'save').mockResolvedValueOnce(mockSpaceChangeWaitlistItem);
      jest.spyOn(residentCompanyRepository, 'update').mockResolvedValue(mockSpaceChangeWaitlistItem.residentCompany);
      jest.spyOn(residentCompanyService, 'updateCompanyHistoryAfterSavingSpaceChangeWaitlist').mockRejectedValueOnce(mockResidentHistory);
      try {
        await residentCompanyService.addToSpaceChangeWaitList(payload, siteIdArr, req);
      } catch (e) {
        expect(e.status).toBe(500);
        expect(e.response.status).toBe('Error');
        expect(e.response.message).toEqual('Could not update Resident Company History record');
      }
    });
  });

  describe('should test getCategoryCount method', () => {
    const categoryStats = [
      {
        "name": "Diagnostics/Biomarkers",
        "industrycount": 55
      },
      {
        "name": "Digital Health",
        "industrycount": 38
      },
      {
        "name": "Veterinary Medicine",
        "industrycount": 36
      }
    ]
    
  let mockrcList = [
    {id:1,industry:[96,92]}
  ]
    it('should return resident companies coint associated with industies for sponser dashboard', async () => {
      jest.spyOn(residentCompanyRepository, 'query').mockResolvedValue(mockrcList);
      jest.spyOn(residentCompanyService, 'getCategoryCount').mockResolvedValue(categoryStats);
      let result = await residentCompanyService.getCategoryCount(0,mockCatCount);
      expect(result).toStrictEqual(categoryStats);
    });

    it('should return resident companies coint associated with industies for sites', async () => {
      jest.spyOn(residentCompanyRepository, 'query').mockResolvedValue(mockrcList);
      jest.spyOn(residentCompanyService, 'getCategoryCount').mockResolvedValue(categoryStats);
      let siteResult = await residentCompanyService.getCategoryCount(1,mockCatCount);
      expect(siteResult).toStrictEqual(categoryStats);
    });
  });


  /** *********** BIOL-235/BIOL-162 ************** */
  describe('fetchOnboardedCompaniesBySiteId() method', () => {

    const mockRcArray: any[] = [];
    mockRcArray.push(mockRC);

    const createQueryBuilder: any = {
      select: () => createQueryBuilder,
      addSelect: () => createQueryBuilder,
      groupBy: () => createQueryBuilder,
      where: () => createQueryBuilder,
      andWhere: () => createQueryBuilder,
      getRawMany: () => mockRcArray,
    };

    it('it should return list of onboarded resident companies for weekly frequency', async () => {
      jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);
      try {
        await residentCompanyService.fetchOnboardedCompaniesBySiteId([1, 2], ApplicationConstants.ONBOARDED_COMPANIES, EmailFrequency.Weekly, 'frequency');
      } catch (err) {
        expect(err instanceof BiolabsException).toBeTruthy();
        expect(err.message).toEqual('Error in fetching data for ONBOARDED_COMPANIES for sponsor user.');
      }
      // expect(result.length > 0).toBeTruthy();
      // expect(result[0].id).toEqual(1);
    });

    it('it should return list of graduated resident companies for monthly frequency', async () => {
      jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);
      try {
        let result = await residentCompanyService.fetchOnboardedCompaniesBySiteId([1, 2], ApplicationConstants.GRADUATED_COMPANIES, EmailFrequency.Monthly, 'frequency');
        expect(result.length > 0).toBeTruthy();
        expect(result[0].id).toEqual(1);
      } catch (err) {
        expect(err instanceof BiolabsException).toBeTruthy();
        expect(err.message).toEqual('Error in fetching data for GRADUATED_COMPANIES for sponsor user.');
      }
    });

    it('it should return list of onboarded resident companies for quarterly frequency', async () => {

      jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockImplementation(() => createQueryBuilder);
      try {
        let result = await residentCompanyService.fetchOnboardedCompaniesBySiteId([1, 2], ApplicationConstants.GRADUATED_COMPANIES, EmailFrequency.Quarterly, 'frequency');
      } catch (err) {
        console.log(err);
        expect(err instanceof BiolabsException).toBeTruthy();
        expect(err.message).toEqual('Error in fetching data for GRADUATED_COMPANIES for sponsor user.');
      }
      // expect(result.length > 0).toBeTruthy();
      // expect(result[0].id).toEqual(1);
    });

    it('it should throw BiolabsException', async () => {
      jest.spyOn(residentCompanyRepository, 'createQueryBuilder').mockReturnValue(new BiolabsException('Error in fetching data for ONBOARDED_COMPANIES for sponsor user.'));
      try {
        await residentCompanyService.fetchOnboardedCompaniesBySiteId([1, 2], ApplicationConstants.ONBOARDED_COMPANIES, EmailFrequency.Weekly, 'frequency');
      } catch (e) {
        expect(e.name).toBe('BiolabsException');
        expect(e instanceof BiolabsException).toBeTruthy();
        expect(e.message).toEqual('Error in fetching data for ONBOARDED_COMPANIES for sponsor user.');
      }
    });
  });

  describe('getAllSites() method', () => {
    let mockSites: Array<any> = [{ "id": 2, "name": "Ipsen" }, { "id": 1, "name": "Tufts" }];

    it('it should return list of site objects', async () => {
      jest.spyOn(siteRepository, 'find').mockResolvedValueOnce(mockSites);

      let result = await residentCompanyService.getAllSites();

      expect(result.length > 0).toBeTruthy();
      expect(result[0].id).toEqual(2);
      expect(result[0].name).toEqual('Ipsen');
    });

    it('it should throw BiolabsException', async () => {
      jest.spyOn(siteRepository, 'find').mockRejectedValueOnce(new BiolabsException('Error in fetching all sites.'));
      try {
        await residentCompanyService.getAllSites();
      } catch (err) {
        expect(err instanceof BiolabsException).toBeTruthy();
        expect(err.message).toEqual('Error in fetching all sites.');
      }
    });
  });

});
