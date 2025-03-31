## ERP Project


user enter form -> review form -> confirm booking by system -> confirm booking by contacting user -> get appointment date -> enter queue -> assign resource -> contact for inbound delivery -> enter delivery -> confirm delivery -> in queue -> repair -> remarks -> contact customer for return -> confirm received



## to setup project

npm install
npx prisma migrate dev
npm run dev
npx prisma db push


npm jest


## Customer Journey Steps Mapped to Statuses

| **Status**           | **Steps**                                                                 |
|-----------------------|--------------------------------------------------------------------------|
| **DRAFT**            | Enter form, review form.                                                 |
| **IN REVIEW**        | Confirm by system.                                                       |
| **CONFIRMED**        | Customer confirmation, appointment date, enter queue, assign resource.   |
| **PENDING DELIVERY** | Contact for delivery, enter delivery, confirm delivery.                 |
| **IN QUEUE**         | Await turn in the queue.                                                 |
| **IN PROGRESS**      | Technician resolves the issue.                                           |
| **RESOLVED/REJECTED**| Add remarks (resolved or rejected).                                      |
| **OUTBOUND DELIVERY**| Arrange outbound delivery, payment, confirm outbound delivery.          |
| **COMPLETED**        | Confirm receipt by customer.                                             |
