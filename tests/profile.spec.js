import { test, expect } from "playwright-test-coverage";

test("View Profile Page", async ({ page }) => {
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

  await page.route("*/**/api/order", async (route) => {
    const orderRes = {
      dinerId: 4,
      orders: [
        {
          id: 1,
          franchiseId: 1,
          storeId: 1,
          date: "2025-01-16T18:57:25.000Z",
          items: [
            {
              id: 1,
              menuId: 1,
              description: "Veggie",
              price: 0.0038,
            },
          ],
        },
        {
          id: 80,
          franchiseId: 1,
          storeId: 1,
          date: "2025-02-13T21:12:21.000Z",
          items: [
            { id: 59, menuId: 2, description: "Pepperoni", price: 0.0042 },
            { id: 60, menuId: 1, description: "Veggie", price: 0.0038 },
            { id: 61, menuId: 3, description: "Margarita", price: 0.0042 },
            { id: 62, menuId: 4, description: "Crusty", price: 0.0028 },
            {
              id: 63,
              menuId: 5,
              description: "Charred Leopard",
              price: 0.0099,
            },
          ],
        },
        {
          id: 81,
          franchiseId: 1,
          storeId: 1,
          date: "2025-02-13T21:14:10.000Z",
          items: [
            { id: 64, menuId: 2, description: "Pepperoni", price: 0.0042 },
            { id: 65, menuId: 1, description: "Veggie", price: 0.0038 },
            { id: 66, menuId: 3, description: "Margarita", price: 0.0042 },
            { id: 67, menuId: 4, description: "Crusty", price: 0.0028 },
            {
              id: 68,
              menuId: 5,
              description: "Charred Leopard",
              price: 0.0099,
            },
          ],
        },
        {
          id: 82,
          franchiseId: 1,
          storeId: 1,
          date: "2025-02-13T21:15:45.000Z",
          items: [
            { id: 69, menuId: 2, description: "Pepperoni", price: 0.0042 },
            { id: 70, menuId: 1, description: "Veggie", price: 0.0038 },
            { id: 71, menuId: 3, description: "Margarita", price: 0.0042 },
            { id: 72, menuId: 4, description: "Crusty", price: 0.0028 },
            {
              id: 73,
              menuId: 5,
              description: "Charred Leopard",
              price: 0.0099,
            },
          ],
        },
        {
          id: 83,
          franchiseId: 1,
          storeId: 1,
          date: "2025-02-13T21:25:58.000Z",
          items: [
            { id: 74, menuId: 2, description: "Pepperoni", price: 0.0042 },
            { id: 75, menuId: 1, description: "Veggie", price: 0.0038 },
            { id: 76, menuId: 3, description: "Margarita", price: 0.0042 },
            { id: 77, menuId: 4, description: "Crusty", price: 0.0028 },
            {
              id: 78,
              menuId: 5,
              description: "Charred Leopard",
              price: 0.0099,
            },
          ],
        },
        {
          id: 84,
          franchiseId: 1,
          storeId: 1,
          date: "2025-02-13T21:27:53.000Z",
          items: [
            { id: 79, menuId: 2, description: "Pepperoni", price: 0.0042 },
            { id: 80, menuId: 1, description: "Veggie", price: 0.0038 },
            { id: 81, menuId: 3, description: "Margarita", price: 0.0042 },
            { id: 82, menuId: 4, description: "Crusty", price: 0.0028 },
            {
              id: 83,
              menuId: 5,
              description: "Charred Leopard",
              price: 0.0099,
            },
          ],
        },
      ],
      page: 1,
    };
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: orderRes });
  });

  await page.goto("/");

  //Login
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("t@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("test");
  await page.getByRole("button", { name: "Login" }).click();

  await page.waitForTimeout(3000);

  //View Profile Page
  await page.getByRole("link", { name: "t", exact: true }).click();
  await expect(page.getByRole("heading")).toContainText("Your pizza kitchen");
  await expect(page.getByRole("main")).toContainText("name:");
  await expect(page.getByRole("main")).toContainText("email:");
  await expect(page.getByRole("main")).toContainText("role:");
  await expect(page.getByRole("main")).toContainText(
    "Here is your history of all the good times."
  );
});
