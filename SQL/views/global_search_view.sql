CREATE OR REPLACE VIEW GLOBAL_SEARCH_VIEW as
SELECT 
string_agg(distinct fun.name, ',') AS fundingSrcName,
string_agg(distinct ind.name, ',') AS industryName,
string_agg(distinct moda.name, ',') AS modalityName,
string_agg(distinct s.name, ',') AS siteName,
string_agg(distinct stage.name, ',') AS techStageName,
string_agg(distinct bsrc.name, ',') AS bSourcesName,
string_agg(distinct rca.name, ',') AS advisoryName,
string_agg(distinct rca.title, ',') AS advisoryTitle,
string_agg(distinct rca.organization, ',') AS advisoryOrg,
-- rca.name AS advisoryName, rca.title AS advisoryTitle, rca.organization AS advisoryOrg,
rc.id, rc.email, rc.name, rc."companyName", rc.site, rc."biolabsSources", "otherBiolabsSources", technology, "rAndDPath", "startDate", "companySize", "foundedPlace", "companyStage", "otherCompanyStage", funding, "fundingSource", "otherFundingSource", "intellectualProperty", "otherIntellectualProperty", "isAffiliated", "affiliatedInstitution", "noOfFullEmp", "empExpect12Months", 
rc."utilizeLab", rc."expect12MonthsUtilizeLab", rc."industry",
rc."otherIndustries":: text,
modality, "otherModality":: text, "preferredMoveIn", rc.status, "companyStatus", "companyVisibility", "companyOnboardingStatus", "elevatorPitch", "logoOnWall", "logoOnLicensedSpace", "bioLabsAssistanceNeeded", "technologyPapersPublished", "technologyPapersPublishedLinkCount", "technologyPapersPublishedLink", "patentsFiledGranted", "patentsFiledGrantedDetails", "foundersBusinessIndustryBefore", "academiaPartnerships", "academiaPartnershipDetails", "industryPartnerships", "industryPartnershipsDetails", newsletters, "shareYourProfile", "equipmentOnsite", website, "foundersBusinessIndustryName", rc."createdAt", rc."updatedAt", pitchdeck, "logoImgUrl", "committeeStatus", "selectionDate", "companyStatusChangeDate"

FROM public.resident_companies rc
LEFT JOIN "fundings" fun ON fun.id = Any("fundingSource")
LEFT JOIN "categories" ind ON ind.id = Any("industry")
LEFT JOIN "modalities" moda ON moda.id = Any("modality")
LEFT JOIN "sites" s ON s.id = Any("site")
LEFT JOIN "technology_stages" stage ON stage.id = rc."companyStage"
LEFT JOIN "biolabs_sources" bsrc ON bsrc.id = rc."biolabsSources"
LEFT JOIN "resident_company_advisory" rca ON rca."companyId" = rc."id"
-- WHERE "comnpanyId" = 4
GROUP BY 
rc.id, rc.email, rc.name, rc."companyName", rc.site, rc."biolabsSources",  technology, "rAndDPath", "startDate", "companySize", "foundedPlace", "companyStage", "otherCompanyStage", funding, "fundingSource", "otherFundingSource", "intellectualProperty", "otherIntellectualProperty", "isAffiliated", "affiliatedInstitution", "noOfFullEmp", "empExpect12Months", 
rc."utilizeLab", rc."expect12MonthsUtilizeLab", rc."industry",
rc."otherIndustries":: text,
modality, "otherModality":: text, "preferredMoveIn", rc.status, "companyStatus", "companyVisibility", "companyOnboardingStatus", "elevatorPitch", "logoOnWall", "logoOnLicensedSpace", "bioLabsAssistanceNeeded", "technologyPapersPublished", "technologyPapersPublishedLinkCount", "technologyPapersPublishedLink", "patentsFiledGranted", "patentsFiledGrantedDetails", "foundersBusinessIndustryBefore", "academiaPartnerships", "academiaPartnershipDetails", "industryPartnerships", "industryPartnershipsDetails", newsletters, "shareYourProfile", "equipmentOnsite", website, "foundersBusinessIndustryName", rc."createdAt", rc."updatedAt", pitchdeck, "logoImgUrl", "committeeStatus", "selectionDate", "companyStatusChangeDate"
-- rca.name, rca.title, rca.organization
