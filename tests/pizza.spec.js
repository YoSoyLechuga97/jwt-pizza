import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("/");

  expect(await page.title()).toBe("JWT Pizza");
});

test.describe.serial("My Serial Tests", () => {
  test("purchase with login", async ({ page }) => {
    await page.route("*/**/api/order/menu", async (route) => {
      const menuRes = [
        {
          id: 1,
          title: "Veggie",
          image: "pizza1.png",
          price: 0.0038,
          description: "A garden of delight",
        },
        {
          id: 2,
          title: "Pepperoni",
          image: "pizza2.png",
          price: 0.0042,
          description: "Spicy treat",
        },
      ];
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: menuRes });
    });

    await page.route("*/**/api/franchise", async (route) => {
      const franchiseRes = [
        {
          id: 2,
          name: "LotaPizza",
          stores: [
            { id: 4, name: "Lehi" },
            { id: 5, name: "Springville" },
            { id: 6, name: "American Fork" },
          ],
        },
        { id: 3, name: "PizzaCorp", stores: [{ id: 7, name: "Spanish Fork" }] },
        { id: 4, name: "topSpot", stores: [] },
      ];
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: franchiseRes });
    });

    await page.route("*/**/api/auth", async (route) => {
      const loginReq = { email: "d@jwt.com", password: "a" };
      const loginRes = {
        user: {
          id: 3,
          name: "Kai Chen",
          email: "d@jwt.com",
          roles: [{ role: "diner" }],
        },
        token: "abcdef",
      };
      expect(route.request().method()).toBe("PUT");
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      await route.fulfill({ json: loginRes });
    });

    await page.route("*/**/api/order", async (route) => {
      const orderReq = {
        items: [
          { menuId: 1, description: "Veggie", price: 0.0038 },
          { menuId: 2, description: "Pepperoni", price: 0.0042 },
        ],
        storeId: "4",
        franchiseId: 2,
      };
      const orderRes = {
        order: {
          items: [
            { menuId: 1, description: "Veggie", price: 0.0038 },
            { menuId: 2, description: "Pepperoni", price: 0.0042 },
          ],
          storeId: "4",
          franchiseId: 2,
          id: 23,
        },
        jwt: "eyJpYXQ",
      };
      expect(route.request().method()).toBe("POST");
      expect(route.request().postDataJSON()).toMatchObject(orderReq);
      await route.fulfill({ json: orderRes });
    });

    await page.goto("/");

    // Go to order page
    await page.getByRole("button", { name: "Order now" }).click();

    // Create order
    await expect(page.locator("h2")).toContainText("Awesome is a click away");
    await page.getByRole("combobox").selectOption("4");
    await page
      .getByRole("link", { name: "Image Description Veggie A" })
      .click();
    await page
      .getByRole("link", { name: "Image Description Pepperoni" })
      .click();
    await expect(page.locator("form")).toContainText("Selected pizzas: 2");
    await page.getByRole("button", { name: "Checkout" }).click();

    // Login
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("d@jwt.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("a");
    await page.getByRole("button", { name: "Login" }).click();

    // Pay
    await expect(page.getByRole("main")).toContainText(
      "Send me those 2 pizzas right now!"
    );
    await expect(page.locator("tbody")).toContainText("Veggie");
    await expect(page.locator("tbody")).toContainText("Pepperoni");
    await expect(page.locator("tfoot")).toContainText("0.008 ₿");
    await page.getByRole("button", { name: "Pay now" }).click();

    // Check balance
    await expect(page.getByText("0.008")).toBeVisible();
  });

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
            message: "store deleted"
          };
        expect(route.request().method()).toBe("DELETE");
        await route.fulfill({ json: storeDeleteResponse });          
    });

    await page.goto("/");

    //Login
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email address" }).click();
    await page
      .getByRole("textbox", { name: "Email address" })
      .fill("t@jwt.com");
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
    await page
      .getByRole("textbox", { name: "store name" })
      .fill("newest store");
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

    //Logout
    // await page.getByRole("link", { name: "Logout" }).click();
  });

  test("View About, History, and Franchise", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("http://localhost:5173/");
    await page.getByRole("link", { name: "About" }).click();
    await expect(page.getByRole("main")).toContainText("The secret sauce");
    await page.getByRole("link", { name: "History" }).click();
    await expect(page.getByRole("heading")).toContainText("Mama Rucci, my my");
    await page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Franchise" })
      .click();
    await expect(page.getByRole("main")).toContainText(
      "So you want a piece of the pie?"
    );
  });

  test("View Profile Page", async ({ page }) => {
    test.setTimeout(15000);
    await page.goto("http://localhost:5173/");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByRole("textbox", { name: "Email address" }).click();
    await page
      .getByRole("textbox", { name: "Email address" })
      .fill("t@jwt.com");
    await page.getByRole("textbox", { name: "Password" }).click();
    await page.getByRole("textbox", { name: "Password" }).fill("test");
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForTimeout(3000);
    await page.getByRole("link", { name: "t", exact: true }).click();
    await expect(page.getByRole("heading")).toContainText("Your pizza kitchen");
    await expect(page.getByRole("main")).toContainText("name:");
    await expect(page.getByRole("main")).toContainText("email:");
    await expect(page.getByRole("main")).toContainText("role:");
    await expect(page.getByRole("main")).toContainText(
      "Here is your history of all the good times."
    );
    await page.getByRole("link", { name: "Logout" }).click();
  });

  //Register a new user?

  //Admin things
  test("admin activities", async ({ page }) => {
    test.setTimeout(15000);
    await page.goto("/");
    await page.getByRole("link", { name: "Login" }).click();
    await page
      .getByRole("textbox", { name: "Email address" })
      .fill("a@jwt.com");
    await page.getByRole("textbox", { name: "Password" }).click();
    await page.getByRole("textbox", { name: "Password" }).fill("admin");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.locator("#navbar-dark")).toContainText("Admin");
    await page.getByRole("link", { name: "Admin" }).click();
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
    await expect(page.getByRole("table")).toContainText("franchise test");
    await page
      .getByRole("row", { name: "franchise test t@jwt.com Close" })
      .getByRole("button")
      .click();
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("link", { name: "Logout" }).click();
  });

  test("register page", async ({ page }) => {
    test.setTimeout(15000);
    await page.goto("http://localhost:5173/");
    await page.getByRole("link", { name: "Register" }).click();
    await expect(page.getByRole("heading")).toContainText(
      "Welcome to the party"
    );
    await page.getByRole("textbox", { name: "Full name" }).click();
    await page.getByRole("textbox", { name: "Full name" }).fill("Test");
    await page.getByRole("textbox", { name: "Email address" }).click();
    await page
      .getByRole("textbox", { name: "Email address" })
      .fill("test@jwt.com");
    await page.getByRole("textbox", { name: "Password" }).click();
    await page.getByRole("textbox", { name: "Password" }).fill("test");
    await page.getByRole("textbox", { name: "Email address" }).click();
    await page.getByRole("main").getByText("Login").click();
    await expect(page.getByRole("heading")).toContainText("Welcome back");
  });
});
