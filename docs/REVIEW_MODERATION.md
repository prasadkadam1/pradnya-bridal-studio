# Customer Reviews and Moderation

Customers can submit a review from the public Testimonials page. Submissions are saved with `status: "pending"`, `isFeatured: false`, and are not shown publicly until approved.

In **Admin → Reviews**, staff can approve, reject, or delete each submission. Only approved reviews are returned to the public site, and Firestore rules prevent unauthenticated users from reading pending/rejected reviews or changing review status.

New sample reviews seeded by the app are marked approved. Existing Firestore testimonial documents created before this moderation flow need `status: "approved"` set in Firestore, or need to be approved once from the admin manager, to remain visible publicly.

Public submissions accept a name, location, service category, rating, wedding date, and review text. They do not collect email or phone details.
