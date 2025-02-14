import { test, expect } from "playwright-test-coverage";

test("View Franchisee Page", async ({ page }) => {
  test.setTimeout(15000);
  await page.route("*/**/api/auth", async (route) => {
    const loginReq = { email: "t@jwt.com", password: "test" };
    const loginRes = {
      user: {
        id: 4,
        name: "t@jwt.com",
        email: "t@jwt.com",
        roles: [
          { objectId: 2, role: "franchisee" },
          { objectId: 4, role: "franchisee" },
          { objectId: 111, role: "franchisee" },
        ],
      },
      token: "abcdef",
    };
    expect(route.request().method()).toBe("PUT");
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.route("*/**/api/franchise/*", async (route) => {
    const franchiseRes = [
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
          { id: 152, name: "newest store", totalRevenue: 0 },
        ],
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
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: franchiseRes });
  });

  await page.route("*/**/api/franchise/*/store", async (route) => {
    const storeReq = {
      id: "",
      name: "newest store",
    };
    const storeRes = {
      id: 152,
      franchiseId: 2,
      name: "newest store",
    };
    expect(route.request().method()).toBe("POST");
    expect(route.request().postDataJSON()).toMatchObject(storeReq);
    await route.fulfill({ json: storeRes });
  });

  await page.route("*/**/api/franchise/*/store/*", async (route) => {
    const storeDeleteResponse = {
      message: "store deleted",
    };
    expect(route.request().method()).toBe("DELETE");
    await route.fulfill({ json: storeDeleteResponse });
  });

  await page.goto("/");

  //Login
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("t@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("test");
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForTimeout(1000);

  //Go to Franchisee Page
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("button", { name: "Cancel" }).click();

  //Create new store
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("newest store");
  await page.getByRole("button", { name: "Create" }).click();

  await page.waitForTimeout(3000);

  //Close store
  await page
    .getByRole("row", { name: "newest store 0 ₿ Close" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await page.waitForTimeout(3000);
  await expect(page.locator("tbody")).toContainText("newest store");
  await expect(page.locator("tbody")).toContainText("0 ₿");
  await page
    .getByRole("row", { name: "newest store 0 ₿ Close" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "Close" }).click();
});
