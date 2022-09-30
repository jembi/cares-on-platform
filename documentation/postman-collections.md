# Postman Collections

**Note**: The CARES on Platform reference implementation supports both COVID19 and HIV.

In order to view the reference implementation in action, please send messages to the CDR using one of the following Postman Collections:

* [HIV & COVID19 Postman Collection](https://www.postman.com/jembi-platform/workspace/jembi-public/collection/23345468-72eafb5d-6ce7-4ccc-abb5-49d76e83b270?action=share\&creator=2252804)
* [COVID19 Lab Order Postman Collection](https://www.postman.com/jembi-platform/workspace/jembi-public/collection/2252804-7c71737d-d370-4eec-aaa6-2971ff742b8f?action=share\&creator=2252804)

The following FHIR APIs have been established to enable testing:

* **COVID19 Bundles**:[ ](https://openhimcore.qa.cares.gicsandbox.org/fhir)[https://openhimcore.qa.cares-disi.gicsandbox.org](https://openhimcore.qa.cares-disi.gicsandbox.org)[/fhir](https://openhimcore.qa.cares.gicsandbox.org/fhir)
* **COVID19 Lab Bundles:**[ https://openhimcore.qa.cares-disi.gicsandbox.org/fhir](https://openhimcore.qa.cares.gicsandbox.org/fhir)
* **HIV & COVID Combination Bundles**:[ https://openhimcore.qa.cares-disi.gicsandbox.org/fhir](https://openhimcore.qa.cares.gicsandbox.org/fhir)

The required auth header for all of the above is:

* Authorization:Custom test

You can submit data by using the bundles that are available in the Postman Collection but before doing so, it is essential that you first ensure that the request URL is pointing to the appropriate FHIR implementation API.

The request URL can be seen at the top left of each message bundle.

![](.gitbook/assets/0)

All of the Postman Collections make use of the variable \{{openhimURL\}} which is used to dynamically set the appropriate FHIR API. You can either replace this variable with the URL you want to use or you can leverage the appropriate Postman Environment to set the openhimURL for you. In order to use a Postman Environment, simply select the appropriate environment on the top right of the Postman application.

![](.gitbook/assets/1)

**Introduction to the various bundles in each Postman Collection**

1. **HIV & COVID19 Postman Collection**
   1. This collection is grouped into three key folders:
      1. CARES Bundles:
         1. _Cares Submit random bundle_: This bundle was established to support the need to measure and monitor individuals diagnosed with COVID19 and their status towards being up-to-date vaccinated. **Note**: This collection does not contain the FHIR resources for COVID19 lab order and resulting activities.
      2. CBS Bundles:
         1. _HIV CBS Submit random bundle - full_: This bundle was established for the DISI MVP solution but can also be used by this reference implementation solution.
            1. Limited to this[ dataset](https://docs.google.com/spreadsheets/d/1K22pfrMVlFvgm3AsTMX5HggqbFnVOeLF/edit#gid=2067500832).
         2. _DEMO HIV CBS Submit random bundle - full_: Extends the DISI MVP CBS bundle to include more data points to enable program monitoring and patient care coordination.
            1. Limited to this[ dataset](https://docs.google.com/spreadsheets/d/1vp54C2m-2xSGHKWstd4tSFsTuglz5k6jaCe30MTS\_18/edit#gid=1418121732).
         3. _Program Care & Monitoring HIV CBS Submit random bundle - full_: Further extends the _DEMO HIV CBS Submit random bundle to include additional data points for the purpose of_ program monitoring and patient care coordination.
            1. Limited to the following datasets:
               1. Limited to this[ dataset](https://docs.google.com/spreadsheets/d/1vp54C2m-2xSGHKWstd4tSFsTuglz5k6jaCe30MTS\_18/edit#gid=1418121732).
               2. Includes elements in this[ dataset](https://docs.google.com/spreadsheets/d/1HyTmHJtlfkJkZf2FOZlK2GA3tOFxeFkmEAVlh5XuHYA/edit#gid=0).
      3. CONSOLIDATED Bundles:
         1. _DEMO HIV CBS & CARES Submit random bundle_: This bundle combines the following two bundles:
            1. DEMO HIV CBS Submit random bundle
            2. _Cares Submit random bundle_
         2. _Program Care & Monitoring HIV CBS & CARES Submit random bundle_: This bundle combines the following two bundles:
            1. Program Care & Monitoring HIV CBS Submit random bundle
            2. _Cares Submit random bundle_
         3. _FULL HIV CBS & CARES & LAB ORDER Submit random bundle_: This bundle contains the resources for the bundle “_Program Care & Monitoring HIV CBS & CARES Submit random bundle_” but also includes the various resources to enable you to submit lab orders and lab results within a single message.
            1. This bundle is very useful when wanting to do full testing (HIV, COVID19 and COVID19 Lab)
2. **COVID19 Lab Order Postman Collection**
   1. This collection allows you to perform the following key operations individually:
      1. Submit a new lab order for COVID19:\

         1. _\[EMR] Submit lab Order Bundle_: Submit a request for a new lab order.
      2. Result an existing lab order for COVID19:\

         1.  _\[LAB] Submit lab result Bundle_: Submit a result for an existing lab order.

             **Note**: It is essential that you first GET the PatientID for the newly submitted lab order using the request: _\[LAB] Query new lab orders_. In order to find the PatientID, simply look for the order number in the GET response body and then find the Patient/ID reference value in **ServiceRequest.subject**.

             **Note**: You will then need to take the PatientID value and set the variable in your Postman Collection Pre-request script variable.
      3. Reject an existing request for a COVID19 lab order:\

         1. _\[LAB] Submit lab REJECTION_: Cancels an existing lab order ServiceRequest.
