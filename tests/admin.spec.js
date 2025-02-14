import { test, expect } from "playwright-test-coverage";

test("admin activities", async ({ page }) => {
  test.setTimeout(15000);

  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() === "DELETE") {
      const logoutRes = {
        message: "logout successful",
      };
      expect(route.request().method()).toBe("DELETE");
      await route.fulfill({ json: logoutRes });
    } else {
      const loginReq = { email: "a@jwt.com", password: "admin" };
      const loginRes = {
        user: {
          id: 1,
          name: "常用名字",
          email: "a@jwt.com",
          roles: [
            {
              role: "admin",
            },
          ],
        },
        token: "DRI5h2g",
      };
      expect(route.request().method()).toBe("PUT");
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    }
  });

  await page.route("*/**/api/franchise", async (route) => {
    if (route.request().method() === "POST") {
      const franchiseReq = {
        stores: [],
        id: "",
        name: "franchise test",
        admins: [
          {
            email: "t@jwt.com",
          },
        ],
      };

      const franchiseRes = {
        stores: [],
        id: 216,
        name: "franchise test",
        admins: [
          {
            email: "t@jwt.com",
            id: 4,
            name: "t@jwt.com",
          },
        ],
      };
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(franchiseReq);
      await route.fulfill({ json: franchiseRes });
    } else {
      const franchiseRes = [
        {
          id: 198,
          name: "5d4xutcnco Franchise",
          admins: [
            {
              id: 828,
              name: "010vbt02xe",
              email: "010vbt02xe@admin.com",
            },
          ],
          stores: [],
        },
        {
          id: 216,
          name: "franchise test",
          admins: [
            {
              id: 4,
              name: "t@jwt.com",
              email: "t@jwt.com",
            },
          ],
          stores: [],
        },
        {
          id: 4,
          name: "Jest Franchise",
          admins: [
            {
              id: 4,
              name: "t@jwt.com",
              email: "t@jwt.com",
            },
          ],
          stores: [],
        },
        {
          id: 2,
          name: "Pizza Bois",
          admins: [
            {
              id: 4,
              name: "t@jwt.com",
              email: "t@jwt.com",
            },
          ],
          stores: [
            {
              id: 3,
              name: "testStore",
              totalRevenue: 0,
            },
            {
              id: 4,
              name: "otherStore",
              totalRevenue: 0,
            },
          ],
        },
        {
          id: 3,
          name: "pizzaBois",
          admins: [
            {
              id: 3,
              name: "pizza franchisee",
              email: "f@jwt.com",
            },
          ],
          stores: [],
        },
        {
          id: 1,
          name: "pizzaPocket",
          admins: [
            {
              id: 3,
              name: "pizza franchisee",
              email: "f@jwt.com",
            },
          ],
          stores: [
            {
              id: 1,
              name: "SLC",
              totalRevenue: 0.5835,
            },
          ],
        },
        {
          id: 199,
          name: "q5ea4b5y5a Franchise",
          admins: [
            {
              id: 827,
              name: "o3a0yrixm8",
              email: "o3a0yrixm8@admin.com",
            },
          ],
          stores: [
            {
              id: 132,
              name: "v8hi94ncil Store",
              totalRevenue: 0.0002,
            },
          ],
        },
        {
          id: 111,
          name: "yc0ueh1813 Franchise",
          admins: [
            {
              id: 4,
              name: "t@jwt.com",
              email: "t@jwt.com",
            },
          ],
          stores: [],
        },
        {
          id: 156,
          name: "ygg7srruy Franchise",
          admins: [
            {
              id: 743,
              name: "z781n1vqho",
              email: "z781n1vqho@admin.com",
            },
          ],
          stores: [
            {
              id: 104,
              name: "e7tfdk7e0x Store",
              totalRevenue: 0.0002,
            },
          ],
        },
      ];
      await route.fulfill({ json: franchiseRes });
    }
  });

  await page.route("*/**/api/franchise/*", async (route) => {
    const deleteRes = {
      message: "franchise deleted",
    };
    expect(route.request().method()).toBe("DELETE");
    await route.fulfill({ json: deleteRes });
  });

  await page.goto("/");

  //Login
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();

  //Go to admin page
  await expect(page.locator("#navbar-dark")).toContainText("Admin");
  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.getByRole("heading")).toContainText("Mama Ricci's kitchen");
  await page.waitForTimeout(3000);

  //Add franchise
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page
    .getByRole("textbox", { name: "franchise name" })
    .fill("franchise test");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("t@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();

  //Delete franchise
  await expect(page.getByRole("table")).toContainText("franchise test");
  await page
    .getByRole("row", { name: "franchise test t@jwt.com Close" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Close" }).click();
  
  //Logout
  await page.getByRole("link", { name: "Logout" }).click();
});
