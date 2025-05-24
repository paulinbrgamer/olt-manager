// filterBySearch.test.ts
import { describe, it, expect } from "vitest";
import { filterBySearch } from "@/utils/filterBySearch"; // ajuste o path conforme seu projeto
import olts from "@/constants/olts"; // supondo que você exportou os dados dos OLTs
import onus from "@/constants/onuListTest"; // supondo que você exportou os dados dos ONUs

describe("filterBySearch", () => {
  it("deve retornar todos os OLTs se o termo de busca for vazio", () => {
    const result = filterBySearch(olts, "", ["location"]);
    expect(result).toEqual(olts);
  });

  it("deve filtrar os OLTs pelo nome da localização", () => {
    const result = filterBySearch(olts, "Aurora", ["location"]);
    expect(result).toHaveLength(1);
    expect(result[0].location).toBe("Aurora");
  });

  it("deve filtrar os ONUs por nome de usuário", () => {
    const result = filterBySearch(onus, "monique", ["name"]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toContain("monique");
  });

  it("deve ser case-insensitive", () => {
    const result = filterBySearch(onus, "MoNiQuE", ["name"]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toContain("monique");
  });

  it("deve funcionar com campos do tipo número convertidos para string", () => {
    const result = filterBySearch(onus, "3", ["slot", "pon", "id"]);
    expect(result.length).toBeGreaterThan(1); // existem várias ONUs com slot/pon/id igual a "3"
  });

  it("deve retornar array vazio se não houver correspondência", () => {
    const result = filterBySearch(olts, "localizacao-inexistente", ["location"]);
    expect(result).toEqual([]);
  });
});
