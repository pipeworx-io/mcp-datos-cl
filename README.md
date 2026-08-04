# @pipeworx/datos-cl

[datos.gob.cl](https://datos.gob.cl/) MCP — Chile government CKAN open-data catalogue, keyless.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

Same CKAN action surface as other CKAN packs:
- `package_list(limit?, offset?)`
- `package_search(q?, fq?, sort?, rows?, start?, facet_field?)`
- `package_show(id)`
- `organization_list(all_fields?, limit?, offset?)`
- `organization_show(id, include_datasets?)`
- `group_list(all_fields?, limit?, offset?)`
- `group_show(id, include_datasets?)`
- `tag_list(query?, all_fields?, vocabulary_id?)`
- `recently_changed_packages(limit?, offset?)`
- `resource_show(id)`

## Data source

`https://datos.gob.cl/api/3/action`

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "datos-cl": {
      "url": "https://gateway.pipeworx.io/datos-cl/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Datos Cl data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
