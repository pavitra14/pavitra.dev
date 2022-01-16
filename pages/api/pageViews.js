import {
    google
} from 'googleapis';

export default async (req, res) => {
    const startDate = req.query.startDate || '2021-03-01';
    const slug = "/" + req.query.q;

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                client_id: process.env.GOOGLE_CLIENT_ID,
                private_key: process.env.GOOGLE_PRIVATE_KEY,
            },
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        });


        const analytics = google.analytics({
            auth,
            version: 'v3',
          });
      
          const response = await analytics.data.ga.get({
            'end-date': 'today',
            ids: `ga:${process.env.GOOGLE_ANALYTICS_VIEW_ID}`,
            metrics: 'ga:pageviews',
            dimensions: 'ga:pagePathLevel2',
            filters: `ga:pagePathLevel2==${slug}`,
            'start-date': startDate,
          });
      
          const pageViews = response?.data?.totalsForAllResults['ga:pageviews'];
      
          return res.status(200).json({
            pageViews
          });
      
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}