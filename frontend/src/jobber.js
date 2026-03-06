// Direct Jobber GraphQL API — calls go from the browser straight to Jobber
// (same as the curl commands that worked instantly).

export const JOBBER_API_URL = 'https://api.getjobber.com/api/graphql';
export const JOBBER_API_VERSION = '2025-04-16';
export const JOBBER_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOjM3NzE5NTIsImlzcyI6Imh0dHBzOi8vYXBpLmdldGpvYmJlci5jb20iLCJjbGllbnRfaWQiOiIwYTgxZmE2Yi02YzlhLTQ5NWUtYTdmNC04YjI0OGFlYWI2OGMiLCJzY29wZSI6InJlYWRfY2xpZW50cyB3cml0ZV9jbGllbnRzIHJlYWRfcmVxdWVzdHMgd3JpdGVfcmVxdWVzdHMgcmVhZF9xdW90ZXMgd3JpdGVfcXVvdGVzIHJlYWRfam9icyB3cml0ZV9qb2JzIHJlYWRfc2NoZWR1bGVkX2l0ZW1zIHdyaXRlX3NjaGVkdWxlZF9pdGVtcyByZWFkX2ludm9pY2VzIHdyaXRlX2ludm9pY2VzIHJlYWRfam9iYmVyX3BheW1lbnRzIHJlYWRfdXNlcnMgd3JpdGVfdXNlcnMgd3JpdGVfdGF4X3JhdGVzIHJlYWRfZXhwZW5zZXMgd3JpdGVfZXhwZW5zZXMgcmVhZF9jdXN0b21fZmllbGRfY29uZmlndXJhdGlvbnMgd3JpdGVfY3VzdG9tX2ZpZWxkX2NvbmZpZ3VyYXRpb25zIHJlYWRfdGltZV9zaGVldHMgcmVhZF9lcXVpcG1lbnQgd3JpdGVfZXF1aXBtZW50IiwiYXBwX2lkIjoiMGE4MWZhNmItNmM5YS00OTVlLWE3ZjQtOGIyNDhhZWFiNjhjIiwidXNlcl9pZCI6Mzc3MTk1MiwiYWNjb3VudF9pZCI6MjIzOTExMywiZXhwIjoxNzcyODI0MTU4fQ.DiU7TLi3731rev_-wsclq3OWu29me9UjjOeOz7Cjbzw';

// ─── Core fetch ───────────────────────────────────────────────────────────────

export async function jobberQuery(query, variables = null) {
    const res = await fetch(JOBBER_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${JOBBER_TOKEN}`,
            'Content-Type': 'application/json',
            'X-JOBBER-GRAPHQL-VERSION': JOBBER_API_VERSION,
        },
        body: JSON.stringify(variables ? { query, variables } : { query }),
    });
    return res.json();
}

// ─── Clients ──────────────────────────────────────────────────────────────────

export const getAllClients = () =>
    jobberQuery(`{
    clients(first: 100) {
      nodes { id name firstName lastName emails { address } phones { number } createdAt }
    }
  }`);

export const getClientDetail = (id) =>
    jobberQuery(
        `query ClientDetail($id: EncodedId!) {
      client(id: $id) {
        id name firstName lastName companyName
        emails { address primary }
        phones { number primary }
        properties {
          id
          address { street1 street2 city province postalCode country }
        }
        requests {
          nodes { id title requestStatus createdAt }
        }
        quotes {
          nodes {
            id quoteNumber quoteStatus amounts { total subtotal } createdAt
            lineItems { nodes { id name unitPrice quantity totalPrice } }
          }
        }
        jobs {
          nodes {
            id jobNumber title jobStatus createdAt startAt endAt
            visits { nodes { id title startAt endAt isAnytime } }
          }
        }
        invoices {
          nodes { id invoiceNumber invoiceStatus amounts { total } dueDate createdAt }
        }
      }
    }`,
        { id }
    );

// ─── Properties ───────────────────────────────────────────────────────────────

export const createProperty = (clientId, address) =>
    jobberQuery(
        `mutation CreateProperty($input: PropertyCreateInput!) {
      propertyCreate(input: $input) {
        property { id address { street1 city province postalCode country } }
        userErrors { message path }
      }
    }`,
        { input: { clientId, address } }
    );

// ─── Requests ─────────────────────────────────────────────────────────────────

export const createRequest = (clientId, title, description, propertyId) =>
    jobberQuery(
        `mutation CreateRequest($input: RequestCreateInput!) {
      requestCreate(input: $input) {
        request { id title requestStatus createdAt }
        userErrors { message path }
      }
    }`,
        {
            input: {
                clientId,
                title,
                ...(description && { description }),
                ...(propertyId && { propertyId }),
            },
        }
    );

// ─── Quotes ───────────────────────────────────────────────────────────────────

export const createQuote = (clientId, lineItems, requestId) =>
    jobberQuery(
        `mutation CreateQuote($input: QuoteCreateInput!) {
      quoteCreate(input: $input) {
        quote { id quoteNumber quoteStatus amounts { total subtotal } createdAt }
        userErrors { message path }
      }
    }`,
        {
            input: {
                clientId,
                ...(requestId && { requestId }),
                lineItems: lineItems.map(li => ({
                    name: li.name,
                    description: li.description || '',
                    quantity: String(li.quantity || 1),
                    unitPrice: String(li.unitPrice || 0),
                })),
            },
        }
    );

export const sendQuote = (quoteId) =>
    jobberQuery(
        `mutation SendQuote($id: EncodedId!) {
      quoteSendEmail(quoteId: $id) {
        quote { id quoteStatus }
        userErrors { message }
      }
    }`,
        { id: quoteId }
    );

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const createJob = (clientId, quoteId, title) =>
    jobberQuery(
        `mutation CreateJob($input: JobCreateInput!) {
      jobCreate(input: $input) {
        job { id jobNumber title jobStatus createdAt }
        userErrors { message path }
      }
    }`,
        {
            input: {
                clientId,
                ...(quoteId && { quoteId }),
                title: title || 'Service Job',
            },
        }
    );

export const createVisit = (jobId, startAt, endAt) =>
    jobberQuery(
        `mutation CreateVisit($input: VisitCreateInput!) {
      visitCreate(input: $input) {
        visit { id title startAt endAt isAnytime }
        userErrors { message path }
      }
    }`,
        { input: { jobId, startAt, endAt } }
    );

export const completeJob = (jobId) =>
    jobberQuery(
        `mutation CompleteJob($id: EncodedId!) {
      jobComplete(jobId: $id) {
        job { id jobStatus }
        userErrors { message }
      }
    }`,
        { id: jobId }
    );

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const createInvoice = (jobId) =>
    jobberQuery(
        `mutation CreateInvoice($input: InvoiceCreateInput!) {
      invoiceCreate(input: $input) {
        invoice { id invoiceNumber invoiceStatus amounts { total } createdAt dueDate }
        userErrors { message path }
      }
    }`,
        { input: { jobId } }
    );

// ─── Schedule ─────────────────────────────────────────────────────────────────

export const getJobsWithVisits = () =>
    jobberQuery(`{
    jobs(first: 200) {
      nodes {
        id jobNumber title jobStatus
        client { id name }
        property { address { street1 city } }
        startAt endAt
        visits {
          nodes { id title startAt endAt isAnytime }
        }
      }
    }
  }`);
