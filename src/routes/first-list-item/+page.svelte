<script>
	import FirstListItem from '$lib/FirstListItem.svelte';
</script>

<h1>FirstListItem</h1>
<FirstListItem collection="posts" filter={'title="Test Submission"'} let:record>
	<h2>{record.title}</h2>
</FirstListItem>
