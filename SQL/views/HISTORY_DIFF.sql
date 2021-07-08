CREATE OR REPLACE VIEW HISTORY_DIFF as
SELECT string_agg(distinct fun.name, ',') AS fundingSrcName,
string_agg(distinct ind.name, ',') AS industryName,
string_agg(distinct moda.name, ',') AS modalityName,
string_agg(distinct s.name, ',') AS siteName,
string_agg(distinct stage.name, ',') AS techStageName,
string_agg(distinct bsrc.name, ',') AS bSourcesName,
"comnpanyId", "companyName", site, "biolabsSources", "otherBiolabsSources", 
technology, "rAndDPath", "companySize", "foundedPlace", "companyStage", "otherCompanyStage", 
funding, "fundingSource", "otherFundingSource", "intellectualProperty", "otherIntellectualProperty", 
"isAffiliated", "affiliatedInstitution", "noOfFullEmp", industry, 
-- "otherIndustries", 
modality,
"elevatorPitch", "logoOnWall",
"technologyPapersPublished", "patentsFiledGranted", 
"patentsFiledGrantedDetails", 
"academiaPartnerships", "academiaPartnershipDetails", "industryPartnerships", "industryPartnershipsDetails", 
max(rch."createdAt") as cdate
FROM public.resident_company_history rch
LEFT JOIN "fundings" fun ON fun.id = Any("fundingSource")
LEFT JOIN "categories" ind ON ind.id = Any("industry")
LEFT JOIN "modalities" moda ON moda.id = Any("modality")
LEFT JOIN "sites" s ON s.id = Any("site")
LEFT JOIN "technology_stages" stage ON stage.id = "companyStage"
LEFT JOIN "biolabs_sources" bsrc ON bsrc.id = "biolabsSources"

-- WHERE "comnpanyId" = 4
GROUP BY "comnpanyId", "companyName", site, "biolabsSources", "otherBiolabsSources", 
technology, "rAndDPath", "companySize", "foundedPlace", "companyStage", "otherCompanyStage", 
funding, "fundingSource", "otherFundingSource", "intellectualProperty", "otherIntellectualProperty", 
"isAffiliated", "affiliatedInstitution", "noOfFullEmp", industry, modality,
"elevatorPitch", "logoOnWall",
"technologyPapersPublished", "patentsFiledGranted", 
"patentsFiledGrantedDetails", 
"academiaPartnerships", "academiaPartnershipDetails", "industryPartnerships", "industryPartnershipsDetails";