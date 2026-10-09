{
  inputs = {
    flake-utils.url = "github:numtide/flake-utils";
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    nixpkgs.inputs.nixpkgs.follows = "nixpkgs";
    devDB.url = "github:hermann-p/nix-postgres-dev-db";
    devDB.inputs.nixpkgs.follows = "nixpkgs";
  };
  outputs = {flake-utils, nixpkgs, devDB, ...}:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        db = devDB.outputs.packages.${system};
      in {
        formatter = pkgs.alejandra;
        devShells = {
          default = pkgs.mkShell {
            buildInputs = [
              pkgs.postgresql_15
              db.start-database
              db.stop-database
              db.psql-wrapped
            ];
            shellHook = ''
              export PG_ROOT=$(git rev-parse --show-toplevel)
            '';
            packages = with pkgs; [
              corepack
              nodejs_22
              # For systems that do not ship with Python by default (required by `node-gyp`)
              python3
            ];
          };
        };
      });
}

