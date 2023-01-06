<script>
	import FirstListItem from '$lib/FirstListItem.svelte';
	import List from '$lib/List.svelte';
</script>

<h2>Record</h2>
<pre>
{`<Record {pb} collection="posts" id="RECORD_ID" let:record>
  <pre>
    {JSON.stringify(record, null, 2)}
  </pre>
</Record>`}
</pre>

<h2>Full List</h2>
<pre>
{`<FullList {pb} collection="posts" let:records>
  {#each records as record}
    <p>{record.title}</p>
  {/each}
</FullList>`}
</pre>

<h2>List</h2>
<List collection="posts" let:records>
	<div slot="loading">
		<h1>Loading...</h1>
	</div>
	{#each records.items as record}
		<p>{record.title}</p>
	{/each}
</List>

<h2>FirstListItem</h2>
<FirstListItem collection="posts" filter={'title="Test Submission"'} let:record>
	<h3>{record.title}</h3>
	<div slot="error" let:error>
		{error}
	</div>
</FirstListItem>
