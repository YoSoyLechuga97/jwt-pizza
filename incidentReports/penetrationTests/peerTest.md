# Security Findings Report  
**Analyst**: Cole Strong  
**Date**: April 14, 2025  

---

## 🧨 Self Attacks

### Broken Access Control - Franchise Listing
| Field | Details |
|-------|---------|
| **Target** | `pizza.chuga329.click` |
| **Classification** | Broken Access Control |
| **Severity** | 4 |
| **Description** | Requesting a list of franchises for any user ID returns a list (though it is empty if you are not the franchise owner). It SHOULD be unauthorized. A more skilled attacker could exploit this. |
| **Corrections** | Ensure the Bearer Token belongs to the `userId` during the `GET` request. |
| **Images** | _To be added in GitHub_ |

---

### Injection - SQL Injection
| Field | Details |
|-------|---------|
| **Researcher** | David Higueros |
| **Date** | April 11, 2025 |
| **Target** | `pizza.pixelshare.click` |
| **Classification** | Injection |
| **Severity** | 2 |
| **Description** | User update requests (and other endpoints) use string concatenation in SQL queries. This creates vulnerabilities to SQL injection, potentially allowing attackers to drop tables. |
| **Corrections** | Use prepared statements with parameter binding for all database queries. |

---

## 🤝 Peer Attacks

### Broken Access Control - Price Altering
| Field | Details |
|-------|---------|
| **Researcher** | Cole Strong |
| **Date** | April 14, 2025 |
| **Target** | `pizza.pixelshare.click` |
| **Classification** | Broken Access Control |
| **Severity** | 1 |
| **Description** | Using Burp Suite, the price of orders can be altered — even made negative — which could theoretically credit money to a customer. |
| **Corrections** | Only accept pizza types and counts in requests. Retrieve prices from the database and calculate totals server-side. |
| **Images** | _To be added in GitHub_ |

---

### Security Misconfiguration - Default Admin Left In
| Field | Details |
|-------|---------|
| **Researcher** | David Higueros |
| **Date** | April 14, 2025 |
| **Target** | `pizza.chuga329.click` |
| **Classification** | Security Misconfiguration |
| **Severity** | 3 |
| **Description** | Default Admin, Franchisee, and Diner accounts were left in the database, allowing login using known credentials. While this may not be present in production, it's a critical issue if left in. |
| **Corrections** | Delete all default users and accounts from the database. |

---

## 🧠 Other Notes

### Insecure Design - Predictable IDs
| Field | Details |
|-------|---------|
| **Date** | April 14, 2025 |
| **Target** | `pizza.chuga329.click` |
| **Classification** | Insecure Design |
| **Severity** | 3 |
| **Description** | UserID, FranchiseID, etc., are auto-incremented starting at 1. An attacker could iterate through IDs to gather data or exploit endpoints. |
| **Corrections** | Use randomized or hashed IDs to reduce predictability and increase security. |

---

### Identification & Authentication Failure - Bearer Tokens Left In
| Field | Details |
|-------|---------|
| **Date** | April 14, 2025 |
| **Target** | `pizza.chuga329.click` |
| **Classification** | Identification and Authentication Failures |
| **Severity** | 4 |
| **Description** | Bearer tokens persist in the database if users don’t log out, allowing continued use past a safe time frame. |
| **Corrections** | Implement token expiration — for example, invalidate after 3 hours of inactivity. |

---
